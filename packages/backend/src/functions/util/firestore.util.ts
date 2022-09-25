/**
 * WARN: node 환경에서만 사용할 것!
 */
import { Timestamp } from '@google-cloud/firestore';
import { Client, Work, Worker, Recruit, Review, WorkSubset } from '../../firestore';

export type ClientDocData = Omit<Client, 'createdAt' | 'updatedAt'> & {
  createdAt: Timestamp,
  updatedAt: Timestamp,
};

export type WorkDocData = Omit<Work, 'createdAt' | 'updatedAt' | 'startDate' | 'endDate' | 'contractedAt'> & {
  createdAt: Timestamp,
  updatedAt: Timestamp,
  startDate: Timestamp,
  endDate: Timestamp,
  contractedAt: Timestamp | null,
};

export type WorkSubsetDocData = Omit<WorkSubset, 'startDate' | 'endDate'> & {
  startDate: Timestamp,
  endDate: Timestamp,
};

export type WorkerDocData = Omit<Worker, 'createdAt' | 'updatedAt' | 'expirationDate'> & {
  createdAt: Timestamp,
  updatedAt: Timestamp,
  expirationDate: Timestamp | null,
};

export type RecruitDocData = Omit<Recruit, 'work' | 'createdAt' | 'contractedAt'> & {
  createdAt: Timestamp,
  contractedAt: Timestamp | null,
  work: WorkSubsetDocData & { id: string, workStatus: string, isContracted: boolean, contractedAt: Timestamp | null },
};

export type ReviewDocData = Omit<Review, 'createdAt' | 'updatedAt' | 'work'> & {
  createdAt: Timestamp,
  updatedAt: Timestamp,
  work: WorkSubsetDocData & { id: string },
};

/**
 * firestore data를 typesaurus format으로 변환하는 함수들
 * 참고: https://github.com/kossnocorp/typesaurus/blob/7ec7091da299592751bca055bc7158e0d8ccaa2a/src/data/index.ts#L60
 */
export function wrapClient(clientDocData: ClientDocData): Client {
  return {
    ...clientDocData,
    createdAt: clientDocData.createdAt.toDate(),
    updatedAt: clientDocData.updatedAt.toDate(),
  };
}

export function wrapWork(workDocData: WorkDocData): Work {
  return {
    ...workDocData,
    createdAt: workDocData.createdAt.toDate(),
    updatedAt: workDocData.updatedAt.toDate(),
    startDate: workDocData.startDate.toDate(),
    endDate: workDocData.endDate.toDate(),
    contractedAt: workDocData.contractedAt ? workDocData.contractedAt.toDate() : null,
  };
}

export function wrapWorker(workerDocData: WorkerDocData): Worker {
  return {
    ...workerDocData,
    createdAt: workerDocData.createdAt.toDate(),
    updatedAt: workerDocData.updatedAt.toDate(),
    expirationDate: workerDocData.expirationDate ? workerDocData.expirationDate.toDate() : null,
  };
}

export function wrapRecruit(recruitDocData: RecruitDocData): Recruit {
  return {
    ...recruitDocData,
    createdAt: recruitDocData.createdAt.toDate(),
    contractedAt: recruitDocData.contractedAt ? recruitDocData.contractedAt.toDate() : null,
    work: {
      ...recruitDocData.work,
      startDate: recruitDocData.work.startDate.toDate(),
      endDate: recruitDocData.work.endDate.toDate(),
      contractedAt: recruitDocData.contractedAt ? recruitDocData.contractedAt.toDate() : null,
    },
  };
}

export function wrapReview(reviewDocData: ReviewDocData): Review {
  return {
    ...reviewDocData,
    createdAt: reviewDocData.createdAt.toDate(),
    updatedAt: reviewDocData.updatedAt.toDate(),
    work: {
      ...reviewDocData.work,
      startDate: reviewDocData.work.startDate.toDate(),
      endDate: reviewDocData.work.endDate.toDate(),
    },
  };
}
