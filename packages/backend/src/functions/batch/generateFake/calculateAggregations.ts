import {
  collection, group, subcollection, all, query, where, update, field, value,
  Doc, ValueServerDate,
} from 'typesaurus';
import { round } from 'lodash';
import {
  WORKER_COLLECTION_ID, FAVORITE_WORKER_COLLECTION_ID, REVIEW_COLLECTION_ID, RECRUIT_COLLECTION_ID, SPECIALTY_COLLECTION_ID, SPECIALTY_WORKER_COLLECTION_ID, WORK_COLLECTION_ID, CLIENT_COLLECTION_ID,
  Review, Worker, Recruit, Work, FavoriteWorker, Client, SpecialtyWorker,
} from '../../../firestore';

export async function calculateAggregations(): Promise<void> {
  console.log('=================================');
  console.log('calculating aggregations...');

  const workersColl = collection<Worker>(WORKER_COLLECTION_ID);
  const favoriteWorkersColl = group(FAVORITE_WORKER_COLLECTION_ID, [
    subcollection<FavoriteWorker, Client>(
      FAVORITE_WORKER_COLLECTION_ID,
      collection<Client>(CLIENT_COLLECTION_ID),
    ),
  ]);
  const reviewsColl = collection<Review>(REVIEW_COLLECTION_ID);
  const recruitsColl = collection<Recruit>(RECRUIT_COLLECTION_ID);
  const worksColl = collection<Work>(WORK_COLLECTION_ID);

  const [
    workerDocs,
    workDocs,
  ] = await Promise.all([
    all(workersColl),
    all(worksColl),
  ]);

  await Promise.all(workerDocs.map(async (workerDoc) => {
    const worker = workerDoc.data;

    // 찜 개수 구하기
    const favoriteWorkerDocs = await query(favoriteWorkersColl, [
      where('workerId', '==', worker.id),
    ]);

    const favoriterCount = favoriteWorkerDocs.length;

    // 리뷰 총점, 평점, 개수 구하기
    const workerReviewDocs = await query(reviewsColl, [
      where(['worker', 'id'], '==', worker.id),
    ]);

    const reviewCount = workerReviewDocs.length;
    let reviewTotalScore = 0;
    let reviewAverageScore = 0;

    if (reviewCount > 0) {
      reviewTotalScore = workerReviewDocs.reduce<number>((totalScore, workerReviewDoc) => {
        const workerReview = workerReviewDoc.data;
        return totalScore + workerReview.score;
      }, 0);

      reviewAverageScore = round(reviewTotalScore / reviewCount, 1);
    }

    // 체결 개수
    const workerRecruitDocs = await query(recruitsColl, [
      where(['worker', 'id'], '==', worker.id),
    ]);

    const contractCount = workerRecruitDocs.reduce<number>((count, workerRecruitDoc) => {
      const workerRecruit = workerRecruitDoc.data;

      if (workerRecruit.isContracted) {
        return count + 1;
      }

      return count;
    }, 0);

    // 분야별 기술자 collection에 있는 기술자 데이터 가져오기
    const specialtyWorkerDocsList = await Promise.all(worker.specialties.map(async (specialty) => {
      const specialtyWorkersColl = collection<SpecialtyWorker>(`${SPECIALTY_COLLECTION_ID}/${specialty}/${SPECIALTY_WORKER_COLLECTION_ID}`);

      const specialtyWorkerDocs = await query(specialtyWorkersColl, [
        where('workerId', '==', worker.id),
      ]);

      return specialtyWorkerDocs;
    }));

    const specialtyWorkerDocs = specialtyWorkerDocsList.reduce<Doc<SpecialtyWorker>[]>((totalDocs, doc) => [
      ...totalDocs,
      ...doc,
    ], []);

    // 기술자 정보 업데이트
    await update(workerDoc.ref, {
      totalScore: reviewTotalScore,
      averageScore: reviewAverageScore,
      reviewCount,
      contractCount,
      favoriterCount,
    });

    await Promise.all(favoriteWorkerDocs.map(async (favoriteWorkerDoc) => {
      await update(favoriteWorkerDoc.ref, {
        averageScore: reviewAverageScore,
        reviewCount,
        contractCount,
      });
    }));

    await Promise.all(workerRecruitDocs.map(async (workerRecruitDoc) => {
      await update(workerRecruitDoc.ref, [
        field(['worker', 'averageScore'], reviewAverageScore),
        field(['worker', 'reviewCount'], reviewCount),
        field(['worker', 'contractCount'], contractCount),
      ]);
    }));

    await Promise.all(specialtyWorkerDocs.map(async (specialtyWorkerDoc) => {
      await update(specialtyWorkerDoc.ref, {
        averageScore: reviewAverageScore,
        reviewCount,
        contractCount,
      });
    }));
  }));

  await Promise.all(workDocs.map(async (workDoc) => {
    const work = workDoc.data;

    const recruitDocs = await query(recruitsColl, [
      where(['work', 'id'], '==', work.id),
      where('isContracted', '==', true),
    ]);

    const contractCount = recruitDocs.length;

    const isContracted = contractCount >= work.requiredWorkers.length;

    let contractedAt: ValueServerDate | null = null;
    if (isContracted) {
      contractedAt = value('serverDate');
    }

    const workRecruitDocs = await query(recruitsColl, [
      where(['work', 'id'], '==', work.id),
    ]);

    await update(workDoc.ref, {
      isContracted,
      contractedAt,
      contractCount,
    });

    await Promise.all(workRecruitDocs.map(async (workRecruitDoc) => {
      await update(workRecruitDoc.ref, [
        field(['work', 'isContracted'], isContracted),
        field(['work', 'contractedAt'], contractedAt),
      ]);
    }));
  }));

  console.log('end!\n');
}
