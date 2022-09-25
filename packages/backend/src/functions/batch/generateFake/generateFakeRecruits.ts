import { collection, all, id, set, value } from 'typesaurus';
import faker from 'faker';
import { random, sampleSize, sample } from 'lodash';
import { FakeOption } from './type';
import {
  WORKER_COLLECTION_ID, WORK_COLLECTION_ID, RECRUIT_COLLECTION_ID, REVIEW_COLLECTION_ID,
  Work, Worker, Recruit, Review,
} from '../../../firestore';

export async function generateFakeRecruits(option: FakeOption): Promise<void> {
  console.log('=================================');
  console.log('generating fake recruits...');

  faker.locale = 'ko';

  const { work: workOption } = option;

  const workersColl = collection<Worker>(WORKER_COLLECTION_ID);
  const worksColl = collection<Work>(WORK_COLLECTION_ID);
  const recruitsColl = collection<Recruit>(RECRUIT_COLLECTION_ID);
  const reviewsColl = collection<Review>(REVIEW_COLLECTION_ID);

  const [
    workerDocs,
    workDocs,
  ] = await Promise.all([
    all(workersColl),
    all(worksColl),
  ]);

  await Promise.all(workDocs.map(async (workDoc) => {
    const recruitingWork = workDoc.data;

    const recruitCount = random(workOption.recruit.count.min, workOption.recruit.count.max);

    const recruitedWorkerDocs = sampleSize(workerDocs, recruitCount);

    await Promise.all(recruitedWorkerDocs.map(async (recruitedWorkerDoc) => {
      const recruitId = await id();

      const recruitedWorker = recruitedWorkerDoc.data;

      const isOffered = sample(workOption.recruit.offeredProbability)!;

      const isContracted = sample(workOption.recruit.contractProbability)!;

      let isReviewed = false;
      if (isContracted) {
        isReviewed = sample(workOption.recruit.reviewProbability)!;
      }

      await set(recruitsColl, recruitId, {
        id: recruitId,
        work: {
          id: recruitingWork.id,
          field: recruitingWork.field,
          startDate: recruitingWork.startDate,
          endDate: recruitingWork.endDate,
          address1: recruitingWork.address1,
          address2: recruitingWork.address2,
          addressDetail: recruitingWork.addressDetail,
          requiredWorkers: recruitingWork.requiredWorkers,
          totalCost: recruitingWork.totalCost,
          title: recruitingWork.title,
          isContracted: recruitingWork.isContracted,
          contractedAt: recruitingWork.contractedAt,
          workStatus: recruitingWork.workStatus,
        },
        worker: {
          id: recruitedWorker.id,
          profileImage: recruitedWorker.profileImage,
          specialties: recruitedWorker.specialties,
          name: recruitedWorker.name,
          phoneNumber: recruitedWorker.phoneNumber,
          averageScore: recruitedWorker.averageScore,
          reviewCount: recruitedWorker.reviewCount,
          contractCount: recruitedWorker.contractCount,
          minWage: recruitedWorker.minWage,
          maxWage: recruitedWorker.maxWage,
          hugeDistricts: recruitedWorker.hugeDistricts,
          districts: recruitedWorker.districts,
        },
        client: {
          id: recruitingWork.client.id,
          name: recruitingWork.client.name,
          phoneNumber: recruitingWork.client.phoneNumber,
        },
        createdAt: value('serverDate'),
        isOffered,
        isAccepted: isContracted || isOffered,
        isContracted,
        contractedAt: isContracted ? value('serverDate') : null,
        isReviewed,
        haveUnreadChatsByClient: false,
        haveUnreadChatsByWorker: false,
      });

      if (isReviewed) {
        const reviewId = await id();

        await set(reviewsColl, reviewId, {
          id: reviewId,
          createdAt: value('serverDate'),
          updatedAt: value('serverDate'),
          score: random(1, 5),
          description: faker.lorem.paragraph(),
          images: [
            'https://firebasestorage.googleapis.com/v0/b/dev---carrot-reboot.appspot.com/o/reviews%2Fblueberry_character.png?alt=media&token=93970fac-359c-40f0-83aa-084a09fdeb6b',
            'https://firebasestorage.googleapis.com/v0/b/dev---carrot-reboot.appspot.com/o/reviews%2Flychee_character.jpeg?alt=media&token=0a83173b-70ab-4294-8f3c-02e74ef1ea94',
          ],
          worker: {
            id: recruitedWorker.id,
            profileImage: recruitedWorker.profileImage,
            specialties: recruitedWorker.specialties,
            name: recruitedWorker.name,
            phoneNumber: recruitedWorker.phoneNumber,
            averageScore: recruitedWorker.averageScore,
            reviewCount: recruitedWorker.reviewCount,
            contractCount: recruitedWorker.contractCount,
            minWage: recruitedWorker.minWage,
            maxWage: recruitedWorker.maxWage,
            hugeDistricts: recruitedWorker.hugeDistricts,
            districts: recruitedWorker.districts,
          },
          client: {
            id: recruitingWork.client.id,
            name: recruitingWork.client.name,
            phoneNumber: recruitingWork.client.phoneNumber,
          },
          work: {
            id: recruitingWork.id,
            field: recruitingWork.field,
            startDate: recruitingWork.startDate,
            endDate: recruitingWork.endDate,
            address1: recruitingWork.address1,
            address2: recruitingWork.address2,
            addressDetail: recruitingWork.addressDetail,
            requiredWorkers: recruitingWork.requiredWorkers,
            totalCost: recruitingWork.totalCost,
            title: recruitingWork.title,
          },
        });
      }
    }));
  }));

  console.log('end!\n');
}
