import {
  collection, query, order, startAfter, limit, where, transaction, id, value, get,
  Cursor, TransactionReadFunction, TransactionWriteFunction, Doc,
} from 'typesaurus';
import { Pagination } from './type';
import { firestoreConfig } from './config';
import {
  CLIENT_COLLECTION_ID, FAVORITE_WORKER_COLLECTION_ID, WORKER_COLLECTION_ID,
  FavoriteWorker, Client, Worker,
} from '../model';

export async function getFavoriteWorkers(clientId: string, cursor?: Cursor<FavoriteWorker, keyof FavoriteWorker> | null): Promise<Pagination<FavoriteWorker>> {
  const favoriteWorkersColl = collection<FavoriteWorker>(`${CLIENT_COLLECTION_ID}/${clientId}/${FAVORITE_WORKER_COLLECTION_ID}`);

  const favoriteWorkerDocs = await query(favoriteWorkersColl, [
    order('createdAt', 'desc', cursor ? [cursor] : undefined),
    limit(firestoreConfig.favoritesPerPage),
  ]);

  return {
    list: favoriteWorkerDocs.map((favoriteWorkerDoc) => favoriteWorkerDoc.data),
    cursor: favoriteWorkerDocs.length > 0 ? startAfter(favoriteWorkerDocs[favoriteWorkerDocs.length - 1]) : null,
  };
}

export async function checkFavoriteWorker(clientId: string, workerId: string): Promise<boolean> {
  const favoriteWorkersColl = collection<FavoriteWorker>(`${CLIENT_COLLECTION_ID}/${clientId}/${FAVORITE_WORKER_COLLECTION_ID}`);

  const favoriteWorkerDocs = await query(favoriteWorkersColl, [
    where('workerId', '==', workerId),
    limit(1),
  ]);

  return favoriteWorkerDocs.length > 0;
}

export async function createFavoriteWorker(clientId: string, workerId: string): Promise<string> {
  const clientsColl = collection<Client>(CLIENT_COLLECTION_ID);
  const workersColl = collection<Worker>(WORKER_COLLECTION_ID);
  const clientFavoritesColl = collection<FavoriteWorker>(`${CLIENT_COLLECTION_ID}/${clientId}/${FAVORITE_WORKER_COLLECTION_ID}`);

  type ReadResult = {
    clientDoc: Doc<Client> | null,
    workerDoc: Doc<Worker> | null,
  };

  const transactionRead: TransactionReadFunction<ReadResult> = async (t) => {
    const [
      clientDoc,
      workerDoc,
    ] = await Promise.all([
      get(clientsColl, clientId),
      t.get(workersColl, workerId),
    ]);

    return {
      clientDoc,
      workerDoc,
    };
  };

  const transactionWrite: TransactionWriteFunction<ReadResult, string> = async ({ data: { clientDoc, workerDoc }, ...t }) => {
    if (!clientDoc || !workerDoc) {
      throw new Error(`구인자를 찾지 못했습니다. id: ${clientId}`);
    }

    const client = clientDoc.data;
    const worker = workerDoc.data;

    const favoriteId = await id();

    t.set(clientFavoritesColl, favoriteId, {
      id: favoriteId,
      clientId: client.id,
      workerId: worker.id,
      createdAt: value('serverDate'),
      profileImage: worker.profileImage,
      specialties: worker.specialties,
      name: worker.name,
      phoneNumber: worker.phoneNumber,
      hugeDistricts: worker.hugeDistricts,
      districts: worker.districts,
      averageScore: worker.averageScore,
      reviewCount: worker.reviewCount,
      contractCount: worker.contractCount,
      minWage: worker.minWage,
      maxWage: worker.maxWage,
      expirationDate: worker.expirationDate,
      isActive: worker.isActive,
    });

    t.update(workerDoc.ref, {
      favoriterCount: worker.favoriterCount + 1,
    });

    return favoriteId;
  };

  const favoriteId = await transaction(transactionRead, transactionWrite);
  return favoriteId;
}

export async function deleteFavoriteWorker(clientId: string, workerId: string): Promise<void> {
  const clientsColl = collection<Client>(CLIENT_COLLECTION_ID);
  const workersColl = collection<Worker>(WORKER_COLLECTION_ID);
  const clientFavoritesColl = collection<FavoriteWorker>(`${CLIENT_COLLECTION_ID}/${clientId}/${FAVORITE_WORKER_COLLECTION_ID}`);

  type ReadResult = {
    clientDoc: Doc<Client> | null,
    workerDoc: Doc<Worker> | null,
    favoriteDocs: Doc<FavoriteWorker>[],
  };

  const transactionRead: TransactionReadFunction<ReadResult> = async (t) => {
    const [
      clientDoc,
      workerDoc,
      favoriteDocs,
    ] = await Promise.all([
      get(clientsColl, clientId),
      t.get(workersColl, workerId),
      query(clientFavoritesColl, [
        where('workerId', '==', workerId),
        limit(1),
      ]),
    ]);

    return {
      clientDoc,
      workerDoc,
      favoriteDocs,
    };
  };

  const transactionWrite: TransactionWriteFunction<ReadResult, void> = async ({ data: { clientDoc, workerDoc, favoriteDocs }, ...t }) => {
    if (!clientDoc || !workerDoc || favoriteDocs.length === 0) {
      return;
    }

    const worker = workerDoc.data;

    t.remove(favoriteDocs[0].ref);

    t.update(workerDoc.ref, {
      favoriterCount: worker.favoriterCount - 1,
    });
  };

  await transaction(transactionRead, transactionWrite);
}
