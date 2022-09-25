import {
  collection, query, order, limit, startAfter, transaction, id, value, batch, get,
  Cursor, TransactionReadFunction, TransactionWriteFunction, Doc,
} from 'typesaurus';
import { Pagination, PortfolioCreationValue, PortfolioModificationValue } from './type';
import { firestoreConfig } from './config';
import {
  WORKER_COLLECTION_ID, PORTFOLIO_COLLECTION_ID,
  Portfolio, Worker,
} from '../model';

export async function getWorkerPortfolios(workerId: string, cursor?: Cursor<Portfolio, keyof Portfolio> | null): Promise<Pagination<Portfolio>> {
  const workerPortfoliosColl = collection<Portfolio>(`${WORKER_COLLECTION_ID}/${workerId}/${PORTFOLIO_COLLECTION_ID}`);

  const workerPortfolioDocs = await query(workerPortfoliosColl, [
    order('createdAt', 'desc', cursor ? [cursor] : undefined),
    limit(firestoreConfig.portfoliosPerPage),
  ]);

  return {
    list: workerPortfolioDocs.map((workerPortfolioDoc) => workerPortfolioDoc.data),
    cursor: workerPortfolioDocs.length > 0 ? startAfter(workerPortfolioDocs[workerPortfolioDocs.length - 1]) : null,
  };
}

export async function createWorkerPortfolio(workerId: string, portfolioValue: PortfolioCreationValue): Promise<string> {
  const workersColl = collection<Worker>(WORKER_COLLECTION_ID);
  const workerPortfoliosColl = collection<Portfolio>(`${WORKER_COLLECTION_ID}/${workerId}/${PORTFOLIO_COLLECTION_ID}`);

  const transactionRead: TransactionReadFunction<Doc<Worker> | null> = async (t) => {
    const workerDoc = await t.get(workersColl, workerId);

    return workerDoc;
  };

  const transactionWrite: TransactionWriteFunction<Doc<Worker> | null, string> = async ({ data: workerDoc, ...t }) => {
    if (!workerDoc) {
      throw new Error(`기술자를 찾지 못했습니다. id: ${workerId}`);
    }

    const worker = workerDoc.data;

    const portfolioId = await id();

    t.set(workerPortfoliosColl, portfolioId, {
      id: portfolioId,
      workerId: worker.id,
      createdAt: value('serverDate'),
      updatedAt: value('serverDate'),
      ...portfolioValue,
    });

    t.update(workerDoc.ref, {
      portfolioCount: worker.portfolioCount + 1,
      updatedAt: value('serverDate'),
    });

    return portfolioId;
  };

  const portfolioId = await transaction(transactionRead, transactionWrite);
  return portfolioId;
}

export async function updateWorkerPortfolio(workerId: string, portfolioId: string, portfolioValue: PortfolioModificationValue): Promise<void> {
  const workersColl = collection<Worker>(WORKER_COLLECTION_ID);
  const workerPortfoliosColl = collection<Portfolio>(`${WORKER_COLLECTION_ID}/${workerId}/${PORTFOLIO_COLLECTION_ID}`);

  const [
    workerDoc,
    portfolioDoc,
  ] = await Promise.all([
    get(workersColl, workerId),
    get(workerPortfoliosColl, portfolioId),
  ]);

  if (!workerDoc || !portfolioDoc) {
    return;
  }

  const b = batch();

  b.update(workerDoc.ref, {
    updatedAt: value('serverDate'),
  });

  b.update(portfolioDoc.ref, {
    updatedAt: value('serverDate'),
    ...portfolioValue,
  });

  await b.commit();
}

export async function deleteWorkerPortfolio(workerId: string, portfolioId: string): Promise<void> {
  const workersColl = collection<Worker>(WORKER_COLLECTION_ID);
  const workerPortfoliosColl = collection<Portfolio>(`${WORKER_COLLECTION_ID}/${workerId}/${PORTFOLIO_COLLECTION_ID}`);

  const transactionRead: TransactionReadFunction<Doc<Worker> | null> = async (t) => {
    const workerDoc = await t.get(workersColl, workerId);

    return workerDoc;
  };

  const transactionWrite: TransactionWriteFunction<Doc<Worker> | null, void> = async ({ data: workerDoc, ...t }) => {
    if (!workerDoc) {
      return;
    }

    const worker = workerDoc.data;

    t.remove(workerPortfoliosColl, portfolioId);

    t.update(workerDoc.ref, {
      portfolioCount: worker.portfolioCount - 1,
      updatedAt: value('serverDate'),
    });
  };

  await transaction(transactionRead, transactionWrite);
}
