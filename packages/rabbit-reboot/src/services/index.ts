import firebase from 'firebase/app';
import {
  WORKER_COLLECTION_ID, RECRUIT_COLLECTION_ID,
  Recruit, WorkSubset,
  firestoreConfig,
} from '@kim-pro-git/carrot-reboot-backend/lib/firestore';

export type WorkSubsetDocData = Omit<WorkSubset, 'startDate' | 'endDate'> & {
  startDate: firebase.firestore.Timestamp,
  endDate: firebase.firestore.Timestamp,
};

export type RecruitDocData = Omit<Recruit, 'work' | 'createdAt' | 'contractedAt'> & {
  createdAt: firebase.firestore.Timestamp,
  contractedAt: firebase.firestore.Timestamp | null,
  work: WorkSubsetDocData & { id: string, workStatus: string, isContracted: boolean, contractedAt: firebase.firestore.Timestamp | null },
};

export type CursorDoc = firebase.firestore.DocumentSnapshot;

export type PaginationDoc<T> = {
  list: Array<T>,
  cursor: CursorDoc | null,
};

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

export async function getContractsWithWorker(workerId: string, filter?: string, cursor?: CursorDoc | null): Promise<PaginationDoc<Recruit>> {
  const firestore = firebase.firestore();

  const workerDocSnap = await firestore
    .doc(`${WORKER_COLLECTION_ID}/${workerId}`)
    .get();

  if (!workerDocSnap.exists) {
    throw new Error(`기술자를 찾지 못했습니다. id: ${workerId}`);
  }

  let contractsWithWorkerQuery = firestore
    .collection(RECRUIT_COLLECTION_ID)
    .where('worker.id', '==', workerId)
    .where('isContracted', '==', true);

  switch (filter) {
    /**
     * 작업완료
     */
    case 'past': {
      contractsWithWorkerQuery = contractsWithWorkerQuery
        .where('work.workStatus', '==', 'completed')
        .orderBy('work.endDate', 'desc');
      break;
    }
    /**
     * 작업중
     */
    case 'present': {
      contractsWithWorkerQuery = contractsWithWorkerQuery
        .where('work.workStatus', '==', 'working')
        .orderBy('work.startDate', 'asc');
      break;
    }
    /**
     * 작업예정
     */
    case 'future': {
      contractsWithWorkerQuery = contractsWithWorkerQuery
        .where('work.workStatus', '==', 'scheduled')
        .orderBy('work.startDate', 'asc');
      break;
    }
    /**
     * 모두 보기, 알 수 없는 필터
     */
    default: {
      contractsWithWorkerQuery = contractsWithWorkerQuery.orderBy('contractedAt', 'desc');
    }
  }

  if (cursor) {
    contractsWithWorkerQuery = contractsWithWorkerQuery.startAfter(cursor);
  }

  const contractsWithWorkerQuerySnap = await contractsWithWorkerQuery
    .limit(firestoreConfig.recruitsPerPage)
    .get();

  const contractsWithWorker = contractsWithWorkerQuerySnap.docs.map((contractWithWorkerDocSnap) => wrapRecruit(contractWithWorkerDocSnap.data() as RecruitDocData));

  if (contractsWithWorkerQuerySnap.empty) {
    return {
      list: contractsWithWorker,
      cursor: null,
    };
  }

  return {
    list: contractsWithWorker,
    cursor: contractsWithWorkerQuerySnap.docs[contractsWithWorkerQuerySnap.size - 1],
  };
}
