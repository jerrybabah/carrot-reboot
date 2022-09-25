import {
  collection, get, query, where, limit, id, set, value, update, order, startAfter, batch, field,
  Cursor, Query,
} from 'typesaurus';
import { Pagination, WorkCreationValue, WorkModificationValue, WorkListFilter } from './type';
import { firestoreConfig } from './config';
import {
  WORK_COLLECTION_ID, CLIENT_COLLECTION_ID, RECRUIT_COLLECTION_ID, REVIEW_COLLECTION_ID,
  Work, Client, Recruit, Review, Identity,
  getIdFromIdentity, getWorkFromIdentity,
} from '../model';

export async function getWorksGroupByField(workField: string, filter?: WorkListFilter, cursor?: Cursor<Work, keyof Work> | null): Promise<Pagination<Work>> {
  const worksColl = collection<Work>(WORK_COLLECTION_ID);

  const queries: Query<Work, keyof Work>[] = [
    where('field', '==', workField),
  ];

  if (filter?.address1s !== undefined && filter.address1s.length > 0) {
    queries.push(
      where('address1', 'in', filter.address1s),
    );
  }

  if (filter?.isRecruiting) {
    queries.push(
      where('isContracted', '==', false),
    );
  }

  queries.push(
    order('createdAt', 'desc', cursor ? [cursor] : undefined),
    limit(firestoreConfig.worksPerPage),
  );

  const workDocs = await query(worksColl, queries);

  return {
    list: workDocs.map((workDoc) => workDoc.data),
    cursor: workDocs.length > 0 ? startAfter(workDocs[workDocs.length - 1]) : null,
  };
}

export async function getWork(workId: string): Promise<Work | null> {
  const worksColl = collection<Work>(WORK_COLLECTION_ID);

  const workDoc = await get(worksColl, workId);

  return workDoc ? workDoc.data : null;
}

export async function createWork(clientId: string, workValue: WorkCreationValue): Promise<string> {
  const worksColl = collection<Work>(WORK_COLLECTION_ID);
  const clientsColl = collection<Client>(CLIENT_COLLECTION_ID);

  const clientDoc = await get(clientsColl, clientId);

  if (!clientDoc) {
    throw new Error(`구인자를 찾지 못했습니다. id: ${clientId}`);
  }

  const client = clientDoc.data;

  const workId = await id();

  await set(worksColl, workId, {
    id: workId,
    createdAt: value('serverDate'),
    updatedAt: value('serverDate'),
    client: {
      id: client.id,
      name: client.name,
      phoneNumber: client.phoneNumber,
    },
    field: workValue.field,
    startDate: workValue.startDate,
    endDate: workValue.endDate,
    address1: workValue.address1,
    address2: workValue.address2,
    addressDetail: workValue.addressDetail,
    requiredWorkers: workValue.requiredWorkers,
    totalCost: workValue.requiredWorkers.reduce<number>((totalCost, workerInfo) => (totalCost + workerInfo.wage), 0),
    title: workValue.title,
    description: workValue.description,
    images: workValue.images,
    isContracted: false,
    contractedAt: null,
    workStatus: 'scheduled',
    contractCount: 0,
    haveUncheckedApplicants: false,
  });

  return workId;
}

export async function updateWork(work: Identity<Work>, workValue: WorkModificationValue): Promise<void> {
  const worksColl = collection<Work>(WORK_COLLECTION_ID);

  const workId = getIdFromIdentity(work);

  await update(worksColl, workId, {
    updatedAt: value('serverDate'),
    ...workValue,
  });
}

export async function contractWork(work: Identity<Work>): Promise<void> {
  const worksColl = collection<Work>(WORK_COLLECTION_ID);

  const workId = getIdFromIdentity(work);

  await update(worksColl, workId, {
    isContracted: true,
    contractedAt: value('serverDate'),
  });
}

export async function getClientRecruitingWorks(clientId: string): Promise<Work[]> {
  const worksColl = collection<Work>(WORK_COLLECTION_ID);

  const workDocs = await query(worksColl, [
    where('client.id', '==', clientId),
    where('isContracted', '==', false),
    order('createdAt', 'desc'),
    limit(firestoreConfig.worksPerPage),
  ]);

  return workDocs.map((workDoc) => workDoc.data);
}

export async function getClientRecruitedWorks(clientId: string, filter?: string, cursor?: Cursor<Work, keyof Work> | null): Promise<Pagination<Work>> {
  const worksColl = collection<Work>(WORK_COLLECTION_ID);

  const queries: Query<Work, keyof Work>[] = [
    where('client.id', '==', clientId),
    where('isContracted', '==', true),
  ];

  const cursors = cursor ? [cursor] : undefined;
  const limitQuery = limit(firestoreConfig.worksPerPage);

  switch (filter) {
    /**
     * 작업완료
     */
    case 'past': {
      queries.push(
        where('workStatus', '==', 'completed'),
        order('endDate', 'desc', cursors),
        limitQuery,
      );
      break;
    }
    /**
     * 작업중
     */
    case 'present': {
      queries.push(
        where('workStatus', '==', 'working'),
        order('startDate', 'asc', cursors),
        limitQuery,
      );
      break;
    }
    /**
     * 작업예정
     */
    case 'future': {
      queries.push(
        where('workStatus', '==', 'scheduled'),
        order('startDate', 'asc', cursors),
        limitQuery,
      );
      break;
    }
    /**
     * 모두 보기, 알 수 없는 필터
     */
    default: {
      queries.push(
        order('contractedAt', 'desc', cursors),
        limitQuery,
      );
    }
  }

  const workDocs = await query(worksColl, queries);

  return {
    list: workDocs.map((workDoc) => workDoc.data),
    cursor: workDocs.length > 0 ? startAfter(workDocs[workDocs.length - 1]) : null,
  };
}

export async function checkApplicants(work: Identity<Work>): Promise<void> {
  const worksColl = collection<Work>(WORK_COLLECTION_ID);

  const workId = getIdFromIdentity(work);

  await update(worksColl, workId, {
    haveUncheckedApplicants: false,
  });
}

export async function uncheckApplicants(work: Identity<Work>): Promise<void> {
  const worksColl = collection<Work>(WORK_COLLECTION_ID);

  const workId = getIdFromIdentity(work);

  await update(worksColl, workId, {
    haveUncheckedApplicants: true,
  });
}

export async function syncWorkToRecruits(_work: Identity<Work>): Promise<void> {
  const work = await getWorkFromIdentity(_work);

  const recruitsColl = collection<Recruit>(RECRUIT_COLLECTION_ID);

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const recruitDocs = await query(recruitsColl, [
    where('work.id', '==', work.id),
    where('createdAt', '>=', oneMonthAgo),
  ]);

  const b = batch();

  recruitDocs.forEach((recruitDoc) => {
    b.update(recruitDoc.ref, [
      field(['work', 'field'], work.field),
      field(['work', 'startDate'], work.startDate),
      field(['work', 'endDate'], work.endDate),
      field(['work', 'address1'], work.address1),
      field(['work', 'address2'], work.address2),
      field(['work', 'addressDetail'], work.addressDetail),
      field(['work', 'requiredWorkers'], work.requiredWorkers),
      field(['work', 'totalCost'], work.totalCost),
      field(['work', 'title'], work.title),
    ]);
  });

  await b.commit();
}

export async function syncWorkToReviews(_work: Identity<Work>): Promise<void> {
  const work = await getWorkFromIdentity(_work);

  const reviewsColl = collection<Review>(REVIEW_COLLECTION_ID);

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const reviewDocs = await query(reviewsColl, [
    where('work.id', '==', work.id),
    where('createdAt', '>=', oneMonthAgo),
  ]);

  const b = batch();

  reviewDocs.forEach((reviewDoc) => {
    b.update(reviewDoc.ref, [
      field(['work', 'field'], work.field),
      field(['work', 'startDate'], work.startDate),
      field(['work', 'endDate'], work.endDate),
      field(['work', 'address1'], work.address1),
      field(['work', 'address2'], work.address2),
      field(['work', 'addressDetail'], work.addressDetail),
      field(['work', 'requiredWorkers'], work.requiredWorkers),
      field(['work', 'totalCost'], work.totalCost),
      field(['work', 'title'], work.title),
    ]);
  });

  await b.commit();
}

export async function syncWorkStatusToRecruits(_work: Identity<Work>): Promise<void> {
  const work = await getWorkFromIdentity(_work);

  const recruitsColl = collection<Recruit>(RECRUIT_COLLECTION_ID);

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const recruitDocs = await query(recruitsColl, [
    where('work.id', '==', work.id),
    where('createdAt', '>=', oneMonthAgo),
  ]);

  const b = batch();

  recruitDocs.forEach((recruitDoc) => {
    b.update(recruitDoc.ref, [
      field(['work', 'workStatus'], work.workStatus),
    ]);
  });

  await b.commit();
}

export async function syncWorkContractToRecruits(_work: Identity<Work>): Promise<void> {
  const work = await getWorkFromIdentity(_work);

  const recruitsColl = collection<Recruit>(RECRUIT_COLLECTION_ID);

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const recruitDocs = await query(recruitsColl, [
    where('work.id', '==', work.id),
    where('createdAt', '>=', oneMonthAgo),
  ]);

  const b = batch();

  recruitDocs.forEach((recruitDoc) => {
    b.update(recruitDoc.ref, [
      field(['work', 'isContracted'], work.isContracted),
      field(['work', 'contractedAt'], work.contractedAt),
    ]);
  });

  await b.commit();
}

export async function changeWorksToWorkingStatus(): Promise<void> {
  const worksColl = collection<Work>(WORK_COLLECTION_ID);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const justStartedWorkDocs = await query(worksColl, [
    where('workStatus', '==', 'scheduled'),
    where('startDate', '<', tomorrow),
  ]);

  const b = batch();

  justStartedWorkDocs.forEach((justStartedWorkDoc) => {
    b.update(justStartedWorkDoc.ref, {
      workStatus: 'working',
    });
  });

  await b.commit();
}

export async function changeWorksToCompletedStatus(): Promise<void> {
  const worksColl = collection<Work>(WORK_COLLECTION_ID);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const justFinishedWorkDocs = await query(worksColl, [
    where('workStatus', '==', 'working'),
    where('endDate', '<', today),
  ]);

  const b = batch();

  justFinishedWorkDocs.forEach((justFinishedWorkDoc) => {
    b.update(justFinishedWorkDoc.ref, {
      workStatus: 'completed',
    });
  });

  await b.commit();
}
