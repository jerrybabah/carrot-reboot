import {
  collection, get, query, where, limit, id, set, value, update, transaction, field, order, startAfter,
  Cursor, TransactionReadFunction, TransactionWriteFunction, Doc,
} from 'typesaurus';
import { Pagination } from './type';
import { firestoreConfig } from './config';
import { ContractAlreadyExist, OfferAlreadyExist, ApplicationAlreadyExist } from './error';
import {
  WORKER_COLLECTION_ID, WORK_COLLECTION_ID, RECRUIT_COLLECTION_ID,
  Worker, Work, Recruit, Identity,
  getIdFromIdentity,
} from '../model';

export async function getRecruit(recruitId: string): Promise<Recruit | null> {
  const recruitsColl = collection<Recruit>(RECRUIT_COLLECTION_ID);

  const recruitDoc = await get(recruitsColl, recruitId);

  return recruitDoc ? recruitDoc.data : null;
}

export async function getRecruitByPKs(workId: string, workerId: string): Promise<Recruit | null> {
  const recruitsColl = collection<Recruit>(RECRUIT_COLLECTION_ID);

  const recruitDocs = await query(recruitsColl, [
    where('work.id', '==', workId),
    where('worker.id', '==', workerId),
    limit(1),
  ]);

  return recruitDocs.length > 0 ? recruitDocs[0].data : null;
}

export async function createRecruit(workId: string, workerId: string, isOffered: boolean): Promise<string> {
  const recruit = await getRecruitByPKs(workId, workerId);

  if (recruit) {
    if (recruit.isContracted) {
      throw new ContractAlreadyExist(`이미 체결되었습니다. workId: ${workId}, workerId: ${workerId}`);
    }

    if (recruit.isOffered) {
      throw new OfferAlreadyExist(`이미 작업 요청을 했습니다. workId: ${workId}, workerId: ${workerId}`);
    }

    throw new ApplicationAlreadyExist(`이미 지원을 했습니다. workId: ${workId}, workerId: ${workerId}`);
  }

  const worksColl = collection<Work>(WORK_COLLECTION_ID);
  const workersColl = collection<Worker>(WORKER_COLLECTION_ID);
  const recruitsColl = collection<Recruit>(RECRUIT_COLLECTION_ID);

  const [
    workDoc,
    workerDoc,
  ] = await Promise.all([
    get(worksColl, workId),
    get(workersColl, workerId),
  ]);

  if (!workDoc || !workerDoc) {
    throw new Error(`일자리 또는 기술자를 찾지 못했습니다. workId: ${workId} workerId: ${workerId}`);
  }

  const work = workDoc.data;
  const worker = workerDoc.data;

  const recruitId = await id();

  await set(recruitsColl, recruitId, {
    id: recruitId,
    createdAt: value('serverDate'),
    isOffered,
    isAccepted: isOffered,
    isContracted: false,
    isReviewed: false,
    contractedAt: null,
    haveUnreadChatsByClient: false,
    haveUnreadChatsByWorker: false,
    work: {
      id: work.id,
      field: work.field,
      address1: work.address1,
      address2: work.address2,
      addressDetail: work.addressDetail,
      startDate: work.startDate,
      endDate: work.endDate,
      requiredWorkers: work.requiredWorkers,
      totalCost: work.totalCost,
      title: work.title,
      isContracted: work.isContracted,
      contractedAt: work.contractedAt,
      workStatus: work.workStatus,
    },
    worker: {
      id: worker.id,
      name: worker.name,
      specialties: worker.specialties,
      minWage: worker.minWage,
      maxWage: worker.maxWage,
      phoneNumber: worker.phoneNumber,
      hugeDistricts: worker.hugeDistricts,
      districts: worker.districts,
      profileImage: worker.profileImage,
      reviewCount: worker.reviewCount,
      averageScore: worker.averageScore,
      contractCount: worker.contractCount,
    },
    client: {
      id: work.client.id,
      name: work.client.name,
      phoneNumber: work.client.phoneNumber,
    },
  });

  return recruitId;
}

export async function acceptApplication(recruitId: string): Promise<void> {
  const recruitsColl = collection<Recruit>(RECRUIT_COLLECTION_ID);

  await update(recruitsColl, recruitId, {
    isAccepted: true,
  });
}

export async function contractRecruit(recruitId: string): Promise<void> {
  const recruitsColl = collection<Recruit>(RECRUIT_COLLECTION_ID);

  const recruitDoc = await get(recruitsColl, recruitId);

  if (!recruitDoc) {
    return;
  }

  const recruit = recruitDoc.data;

  if (recruit.isContracted) {
    return;
  }

  const worksColl = collection<Work>(WORK_COLLECTION_ID);
  const workersColl = collection<Worker>(WORKER_COLLECTION_ID);

  type ReadResult = {
    workDoc: Doc<Work> | null,
    workerDoc: Doc<Worker> | null,
  };

  const transactionRead: TransactionReadFunction<ReadResult> = async (t) => {
    const [
      workDoc,
      workerDoc,
    ] = await Promise.all([
      t.get(worksColl, recruit.work.id),
      t.get(workersColl, recruit.worker.id),
    ]);

    return {
      workDoc,
      workerDoc,
    };
  };

  const transactionWrite: TransactionWriteFunction<ReadResult, void> = async ({ data: { workDoc, workerDoc }, ...t }) => {
    if (!workDoc || !workerDoc) {
      return;
    }

    const work = workDoc.data;
    const worker = workerDoc.data;

    t.update(recruitDoc.ref, [
      field('isContracted', true),
      field('contractedAt', value('serverDate')),
      field(['worker', 'contractCount'], worker.contractCount + 1),
    ]);

    t.update(workDoc.ref, {
      contractCount: work.contractCount + 1,
    });

    t.update(workerDoc.ref, {
      contractCount: worker.contractCount + 1,
    });
  };

  await transaction(transactionRead, transactionWrite);
}

export async function getOffersByWork(workId: string, cursor?: Cursor<Recruit, keyof Recruit> | null): Promise<Pagination<Recruit>> {
  const recruitsColl = collection<Recruit>(RECRUIT_COLLECTION_ID);

  const offerDocs = await query(recruitsColl, [
    where('work.id', '==', workId),
    where('isContracted', '==', false),
    where('isOffered', '==', true),
    order('createdAt', 'desc', cursor ? [cursor] : undefined),
    limit(firestoreConfig.recruitsPerPage),
  ]);

  return {
    list: offerDocs.map((offerDoc) => offerDoc.data),
    cursor: offerDocs.length > 0 ? startAfter(offerDocs[offerDocs.length - 1]) : null,
  };
}

export async function getApplicationsToWork(workId: string, cursor?: Cursor<Recruit, keyof Recruit> | null): Promise<Pagination<Recruit>> {
  const recruitsColl = collection<Recruit>(RECRUIT_COLLECTION_ID);

  const applicationDocs = await query(recruitsColl, [
    where('work.id', '==', workId),
    where('isContracted', '==', false),
    where('isOffered', '==', false),
    order('createdAt', 'desc', cursor ? [cursor] : undefined),
    limit(firestoreConfig.recruitsPerPage),
  ]);

  return {
    list: applicationDocs.map((applicationDoc) => applicationDoc.data),
    cursor: applicationDocs.length > 0 ? startAfter(applicationDocs[applicationDocs.length - 1]) : null,
  };
}

export async function getContractsWithWork(workId: string, cursor?: Cursor<Recruit, keyof Recruit> | null): Promise<Pagination<Recruit>> {
  const recruitsColl = collection<Recruit>(RECRUIT_COLLECTION_ID);

  const contractDocs = await query(recruitsColl, [
    where('work.id', '==', workId),
    where('isContracted', '==', true),
    order('contractedAt', 'desc', cursor ? [cursor] : undefined),
    limit(firestoreConfig.recruitsPerPage),
  ]);

  return {
    list: contractDocs.map((contractDoc) => contractDoc.data),
    cursor: contractDocs.length > 0 ? startAfter(contractDocs[contractDocs.length - 1]) : null,
  };
}

export async function getOffersToWorker(workerId: string, cursor?: Cursor<Recruit, keyof Recruit> | null): Promise<Pagination<Recruit>> {
  const recruitsColl = collection<Recruit>(RECRUIT_COLLECTION_ID);

  const offerDocs = await query(recruitsColl, [
    where('worker.id', '==', workerId),
    where('isContracted', '==', false),
    where('isOffered', '==', true),
    order('createdAt', 'desc', cursor ? [cursor] : undefined),
    limit(firestoreConfig.recruitsPerPage),
  ]);

  return {
    list: offerDocs.map((offerDoc) => offerDoc.data),
    cursor: offerDocs.length > 0 ? startAfter(offerDocs[offerDocs.length - 1]) : null,
  };
}

export async function getApplicationsByWorker(workerId: string, cursor?: Cursor<Recruit, keyof Recruit> | null): Promise<Pagination<Recruit>> {
  const recruitsColl = collection<Recruit>(RECRUIT_COLLECTION_ID);

  const applicationDocs = await query(recruitsColl, [
    where('worker.id', '==', workerId),
    where('isContracted', '==', false),
    where('isOffered', '==', false),
    order('createdAt', 'desc', cursor ? [cursor] : undefined),
    limit(firestoreConfig.recruitsPerPage),
  ]);

  return {
    list: applicationDocs.map((applicationDoc) => applicationDoc.data),
    cursor: applicationDocs.length > 0 ? startAfter(applicationDocs[applicationDocs.length - 1]) : null,
  };
}

/**
 * WARN: browser에서만 사용 가능
 * => repl, functions에서 실행 못함
 *
 * typesaurus에서 nested key에 대한 정렬을 지원하지 않는다.
 * reference: https://github.com/kossnocorp/typesaurus/issues/26
 *
 * 필요한 곳에서 구현해서 사용할 것
 * - rabbit
 */
export async function getContractsWithWorker(workerId: string, filter?: string, cursor?: Cursor<Recruit, keyof Recruit> | null): Promise<Pagination<Recruit>> {
  throw new Error('firebase browser sdk를 이용해서 직접 구현할 것');

  // const recruitsColl = collection<Recruit>(RECRUIT_COLLECTION_ID);

  // const queries: Query<Recruit, keyof Recruit>[] = [
  //   where('worker.id', '==', workerId),
  //   where('isContracted', '==', true),
  // ];

  // const cursors = cursor ? [cursor] : undefined;
  // const limitQuery = limit(firestoreConfig.recruitsPerPage);

  // switch (filter) {
  //   /**
  //    * 작업완료
  //    */
  //   case 'past': {
  //     queries.push(
  //       where('work.workStatus', '==', 'completed'),
  //       order('work.endDate', 'desc', cursors),
  //       limitQuery,
  //     );
  //     break;
  //   }
  //   /**
  //    * 작업중
  //    */
  //   case 'present': {
  //     queries.push(
  //       where('work.workStatus', '==', 'working'),
  //       order('work.startDate', 'asc', cursors),
  //       limitQuery,
  //     );
  //     break;
  //   }
  //   /**
  //    * 작업예정
  //    */
  //   case 'future': {
  //     queries.push(
  //       where('work.workStatus', '==', 'scheduled'),
  //       order('work.startDate', 'asc', cursors),
  //       limitQuery,
  //     );
  //     break;
  //   }
  //   /**
  //    * 모두 보기, 알 수 없는 필터
  //    */
  //   default: {
  //     queries.push(
  //       order('contractedAt', 'desc', cursors),
  //       limitQuery,
  //     );
  //   }
  // }

  // const contractDocs = await query(recruitsColl, queries);

  // return {
  //   list: contractDocs.map((contractDoc) => contractDoc.data),
  //   cursor: contractDocs.length > 0 ? startAfter(contractDocs[contractDocs.length - 1]) : null,
  // };
}

export async function readChats(recruit: Identity<Recruit>, reader: 'Client' | 'Worker'): Promise<void> {
  const recruitsColl = collection<Recruit>(RECRUIT_COLLECTION_ID);

  const recruitId = getIdFromIdentity(recruit);

  await update(recruitsColl, recruitId, [
    field(`haveUnreadChatsBy${reader}`, false),
  ]);
}

export async function unreadChats(recruit: Identity<Recruit>, reader: 'Client' | 'Worker'): Promise<void> {
  const recruitsColl = collection<Recruit>(RECRUIT_COLLECTION_ID);

  const recruitId = getIdFromIdentity(recruit);

  await update(recruitsColl, recruitId, [
    field(`haveUnreadChatsBy${reader}`, true),
  ]);
}
