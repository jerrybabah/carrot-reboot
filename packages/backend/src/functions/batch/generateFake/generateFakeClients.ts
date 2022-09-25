import { collection, all, set, id, value } from 'typesaurus';
import faker from 'faker';
import { range, random, sampleSize } from 'lodash';
import { FakeOption } from './type';
import {
  CLIENT_COLLECTION_ID, WORKER_COLLECTION_ID, FAVORITE_WORKER_COLLECTION_ID,
  Client, Worker, FavoriteWorker,
} from '../../../firestore';

export async function generateFakeClients(option: FakeOption): Promise<void> {
  console.log('=================================');
  console.log('generating fake clients...');

  faker.locale = 'ko';

  const { client: clientOption } = option;

  const clientsColl = collection<Client>(CLIENT_COLLECTION_ID);
  const workersColl = collection<Worker>(WORKER_COLLECTION_ID);

  const workerDocs = await all(workersColl);

  await Promise.all(range(0, clientOption.count).map(async () => {
    const clientId = await id();

    await set(clientsColl, clientId, {
      id: clientId,
      createdAt: value('serverDate'),
      updatedAt: value('serverDate'),
      name: `${faker.name.lastName()}${faker.name.firstName()}`,
      phoneNumber: faker.phone.phoneNumberFormat(2).replace(/-/g, ''),
      registrationToken: null,
    });

    const favoriteWorkerCount = random(clientOption.favoriteCount.min, clientOption.favoriteCount.max);
    const favoriteWorkerDocs = sampleSize(workerDocs, favoriteWorkerCount);

    const favoriteWorkersColl = collection<FavoriteWorker>(`${CLIENT_COLLECTION_ID}/${clientId}/${FAVORITE_WORKER_COLLECTION_ID}`);

    await Promise.all(favoriteWorkerDocs.map(async (favoriteWorkerDoc) => {
      const favoriteWorker = favoriteWorkerDoc.data;

      const favoriteWorkerId = await id();

      await set(favoriteWorkersColl, favoriteWorkerId, {
        id: favoriteWorkerId,
        clientId,
        workerId: favoriteWorker.id,
        profileImage: favoriteWorker.profileImage,
        specialties: favoriteWorker.specialties,
        name: favoriteWorker.name,
        phoneNumber: favoriteWorker.phoneNumber,
        averageScore: favoriteWorker.averageScore,
        reviewCount: favoriteWorker.reviewCount,
        contractCount: favoriteWorker.contractCount,
        minWage: favoriteWorker.minWage,
        maxWage: favoriteWorker.maxWage,
        hugeDistricts: favoriteWorker.hugeDistricts,
        districts: favoriteWorker.districts,
        createdAt: value('serverDate'),
        expirationDate: favoriteWorker.expirationDate,
        isActive: favoriteWorker.isActive,
      });
    }));
  }));

  console.log('end!\n');
}
