import {
  collection, get, query, where, limit, id, value, update, transaction, field, order, startAfter,
  Cursor, TransactionReadFunction, TransactionWriteFunction, Doc,
} from 'typesaurus';
import { Pagination, ReviewCreationValue, ReviewModificationValue } from './type';
import { firestoreConfig } from './config';
import {
  WORK_COLLECTION_ID, WORKER_COLLECTION_ID, REVIEW_COLLECTION_ID, RECRUIT_COLLECTION_ID,
  Work, Worker, Review, Recruit,
} from '../model';

export async function createReview(workId: string, workerId: string, reviewValue: ReviewCreationValue): Promise<string> {
  const reviewsColl = collection<Review>(REVIEW_COLLECTION_ID);
  const worksColl = collection<Work>(WORK_COLLECTION_ID);
  const workersColl = collection<Worker>(WORKER_COLLECTION_ID);
  const recruitsColl = collection<Recruit>(RECRUIT_COLLECTION_ID);

  type ReadResult = {
    workDoc: Doc<Work> | null,
    workerDoc: Doc<Worker> | null,
    recruitDocs: Doc<Recruit>[],
  };

  const transactionRead: TransactionReadFunction<ReadResult> = async (t) => {
    const [
      workDoc,
      workerDoc,
      recruitDocs,
    ] = await Promise.all([
      get(worksColl, workId),
      t.get(workersColl, workerId),
      query(recruitsColl, [
        where('work.id', '==', workId),
        where('worker.id', '==', workerId),
        limit(1),
      ]),
    ]);

    return {
      workDoc,
      workerDoc,
      recruitDocs,
    };
  };

  const transactionWrite: TransactionWriteFunction<ReadResult, string> = async ({ data: { workDoc, workerDoc, recruitDocs }, ...t }) => {
    if (!workDoc || !workerDoc || recruitDocs.length === 0) {
      throw new Error(`일자리, 기술자 또는 구인구직을 찾지 못했습니다. workId: ${workId}, workerId: ${workerId}`);
    }

    const work = workDoc.data;
    const worker = workerDoc.data;

    const reviewId = await id();

    t.set(reviewsColl, reviewId, {
      id: reviewId,
      worker: {
        id: worker.id,
        profileImage: worker.profileImage,
        specialties: worker.specialties,
        name: worker.name,
        phoneNumber: worker.phoneNumber,
        averageScore: worker.averageScore,
        reviewCount: worker.reviewCount,
        contractCount: worker.contractCount,
        minWage: worker.minWage,
        maxWage: worker.maxWage,
        hugeDistricts: worker.hugeDistricts,
        districts: worker.districts,
      },
      createdAt: value('serverDate'),
      updatedAt: value('serverDate'),
      client: {
        id: work.client.id,
        name: work.client.name,
        phoneNumber: work.client.phoneNumber,
      },
      work: {
        id: work.id,
        field: work.field,
        address1: work.address1,
        address2: work.address2,
        addressDetail: work.addressDetail,
        requiredWorkers: work.requiredWorkers,
        totalCost: work.totalCost,
        title: work.title,
        startDate: work.startDate,
        endDate: work.endDate,
      },
      ...reviewValue,
    });

    const totalScore = worker.totalScore + reviewValue.score;
    const reviewCount = worker.reviewCount + 1;
    const averageScore = Math.round((totalScore / reviewCount) * 10) / 10;

    t.update(workerDoc.ref, {
      totalScore,
      reviewCount,
      averageScore,
    });

    t.update(recruitDocs[0].ref, [
      field('isReviewed', true),
      field(['worker', 'reviewCount'], reviewCount),
      field(['worker', 'averageScore'], averageScore),
    ]);

    return reviewId;
  };

  const reviewId = await transaction(transactionRead, transactionWrite);
  return reviewId;
}

export async function getWorkerReviews(workerId: string, cursor?: Cursor<Review, keyof Review> | null): Promise<Pagination<Review>> {
  const reviewsColl = collection<Review>(REVIEW_COLLECTION_ID);

  const reviewDocs = await query(reviewsColl, [
    where('worker.id', '==', workerId),
    order('createdAt', 'desc', cursor ? [cursor] : undefined),
    limit(firestoreConfig.reviewsPerPage),
  ]);

  return {
    list: reviewDocs.map((reviewDoc) => reviewDoc.data),
    cursor: reviewDocs.length > 0 ? startAfter(reviewDocs[reviewDocs.length - 1]) : null,
  };
}

export async function getClientReviews(clientId: string, cursor?: Cursor<Review, keyof Review> | null): Promise<Pagination<Review>> {
  const reviewsColl = collection<Review>(REVIEW_COLLECTION_ID);

  const reviewDocs = await query(reviewsColl, [
    where('client.id', '==', clientId),
    order('createdAt', 'desc', cursor ? [cursor] : undefined),
    limit(firestoreConfig.reviewsPerPage),
  ]);

  return {
    list: reviewDocs.map((reviewDoc) => reviewDoc.data),
    cursor: reviewDocs.length > 0 ? startAfter(reviewDocs[reviewDocs.length - 1]) : null,
  };
}

export async function updateReview(reviewId: string, reviewValue: ReviewModificationValue): Promise<void> {
  const reviewsColl = collection<Review>(REVIEW_COLLECTION_ID);
  const workersColl = collection<Worker>(WORKER_COLLECTION_ID);

  /**
   * 점수가 바뀌지 않은 경우
   */
  if (reviewValue.score === undefined) {
    await update(reviewsColl, reviewId, {
      updatedAt: value('serverDate'),
      ...reviewValue,
    });

    return;
  }

  /**
   * 점수가 바뀐 경우
   */
  type ReadResult = {
    reviewDoc: Doc<Review> | null,
    workerDoc: Doc<Worker> | null,
  };

  const transactionRead: TransactionReadFunction<ReadResult> = async (t) => {
    const reviewDoc = await t.get(reviewsColl, reviewId);

    if (!reviewDoc) {
      return {
        reviewDoc,
        workerDoc: null,
      };
    }

    const review = reviewDoc.data;

    const workerDoc = await t.get(workersColl, review.worker.id);

    return {
      reviewDoc,
      workerDoc,
    };
  };

  const transactionWrite: TransactionWriteFunction<ReadResult, void> = async ({ data: { reviewDoc, workerDoc }, ...t }) => {
    if (!reviewDoc || !workerDoc) {
      return;
    }

    const review = reviewDoc.data;
    const worker = workerDoc.data;

    const totalScore = worker.totalScore - review.score + reviewValue.score!;
    const averageScore = Math.round((totalScore / worker.reviewCount) * 10) / 10;

    t.update(reviewDoc.ref, [
      field('score', reviewValue.score || review.score),
      field('images', reviewValue.images || review.images),
      field('description', reviewValue.description || review.description),
      field('updatedAt', value('serverDate')),
      field(['worker', 'averageScore'], averageScore),
    ]);

    t.update(workerDoc.ref, {
      totalScore,
      averageScore,
    });
  };

  await transaction(transactionRead, transactionWrite);
}

export async function deleteReview(reviewId: string): Promise<void> {
  const reviewsColl = collection<Review>(REVIEW_COLLECTION_ID);
  const workersColl = collection<Worker>(WORKER_COLLECTION_ID);

  type ReadResult = {
    reviewDoc: Doc<Review> | null,
    workerDoc: Doc<Worker> | null,
  };

  const transactionRead: TransactionReadFunction<ReadResult> = async (t) => {
    const reviewDoc = await t.get(reviewsColl, reviewId);

    if (!reviewDoc) {
      return {
        reviewDoc,
        workerDoc: null,
      };
    }

    const review = reviewDoc.data;

    const workerDoc = await t.get(workersColl, review.worker.id);

    return {
      reviewDoc,
      workerDoc,
    };
  };

  const transactionWrite: TransactionWriteFunction<ReadResult, void> = async ({ data: { reviewDoc, workerDoc }, ...t }) => {
    if (!reviewDoc || !workerDoc) {
      return;
    }

    const review = reviewDoc.data;
    const worker = workerDoc.data;

    const totalScore = worker.totalScore - review.score;
    const reviewCount = worker.reviewCount - 1;
    const averageScore = Math.round((totalScore / reviewCount) * 10) / 10;

    t.remove(reviewDoc.ref);

    t.update(workerDoc.ref, {
      totalScore,
      reviewCount,
      averageScore,
    });
  };

  await transaction(transactionRead, transactionWrite);
}
