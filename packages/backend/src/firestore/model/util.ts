import { collection, get } from 'typesaurus';
import { Identity } from './common.type';
import { Client } from './client.type';
import { Recruit } from './recruit.type';
import { Review } from './review.type';
import { Work } from './work.type';
import { Worker } from './worker.type';
import { CLIENT_COLLECTION_ID, WORK_COLLECTION_ID, WORKER_COLLECTION_ID, RECRUIT_COLLECTION_ID, REVIEW_COLLECTION_ID } from './constant';

export function mapLargeToHuge(largeDistrict: string): string {
  if (largeDistrict === '서울'
    || largeDistrict === '인천'
    || largeDistrict === '경기'
  ) {
    return '수도권';
  }

  if (largeDistrict === '강원') {
    return '강원';
  }

  if (largeDistrict === '충북'
    || largeDistrict === '충남'
    || largeDistrict === '대전'
    || largeDistrict === '세종'
  ) {
    return '충청';
  }

  if (largeDistrict === '경북'
    || largeDistrict === '경남'
    || largeDistrict === '부산'
    || largeDistrict === '대구'
    || largeDistrict === '울산'
  ) {
    return '영남';
  }

  if (largeDistrict === '전북'
    || largeDistrict === '전남'
    || largeDistrict === '광주'
  ) {
    return '호남';
  }

  if (largeDistrict === '제주') {
    return '제주';
  }

  return 'undefined'; // TODO: production에서는 문제가 생겼더라도 문제 없이 보이도록 하기
}

export function getIdFromIdentity<T extends { id: string }>(identity: Identity<T>): string {
  let id: string;

  if (typeof identity === 'string') {
    id = identity;
  } else if ('__type__' in identity && identity.__type__ === 'doc') {
    id = identity.data.id;
  } else {
    id = identity.id;
  }

  return id;
}

export async function getClientFromIdentity(identity: Identity<Client>): Promise<Client> {
  const clientsColl = collection<Client>(CLIENT_COLLECTION_ID);

  let client: Client;

  if (typeof identity === 'string') {
    const clientDoc = await get(clientsColl, identity);

    if (!clientDoc) {
      throw new Error(`구인자를 찾지 못했습니다. id: ${identity}`);
    }

    client = clientDoc.data;
  } else if ('__type__' in identity && identity.__type__ === 'ref') {
    const clientDoc = await get(identity);

    if (!clientDoc) {
      throw new Error(`구인자를 찾지 못했습니다. id: ${identity.id}`);
    }

    client = clientDoc.data;
  } else if ('__type__' in identity && identity.__type__ === 'doc') {
    client = identity.data;
  } else {
    client = identity;
  }

  return client;
}

export async function getWorkFromIdentity(identity: Identity<Work>): Promise<Work> {
  const worksColl = collection<Work>(WORK_COLLECTION_ID);

  let work: Work;

  if (typeof identity === 'string') {
    const workDoc = await get(worksColl, identity);

    if (!workDoc) {
      throw new Error(`일자리를 찾지 못했습니다. id: ${identity}`);
    }

    work = workDoc.data;
  } else if ('__type__' in identity && identity.__type__ === 'ref') {
    const workDoc = await get(identity);

    if (!workDoc) {
      throw new Error(`일자리를 찾지 못했습니다. id: ${identity.id}`);
    }

    work = workDoc.data;
  } else if ('__type__' in identity && identity.__type__ === 'doc') {
    work = identity.data;
  } else {
    work = identity;
  }

  return work;
}

export async function getWorkerFromIdentity(identity: Identity<Worker>): Promise<Worker> {
  const workersColl = collection<Worker>(WORKER_COLLECTION_ID);

  let worker: Worker;

  if (typeof identity === 'string') {
    const workerDoc = await get(workersColl, identity);

    if (!workerDoc) {
      throw new Error(`기술자를 찾지 못했습니다. id: ${identity}`);
    }

    worker = workerDoc.data;
  } else if ('__type__' in identity && identity.__type__ === 'ref') {
    const workerDoc = await get(identity);

    if (!workerDoc) {
      throw new Error(`기술자를 찾지 못했습니다. id: ${identity.id}`);
    }

    worker = workerDoc.data;
  } else if ('__type__' in identity && identity.__type__ === 'doc') {
    worker = identity.data;
  } else {
    worker = identity;
  }

  return worker;
}

export async function getRecruitFromIdentity(identity: Identity<Recruit>): Promise<Recruit> {
  const recruitsColl = collection<Recruit>(RECRUIT_COLLECTION_ID);

  let recruit: Recruit;

  if (typeof identity === 'string') {
    const recruitDoc = await get(recruitsColl, identity);

    if (!recruitDoc) {
      throw new Error(`구인구직을 찾지 못했습니다. id: ${identity}`);
    }

    recruit = recruitDoc.data;
  } else if ('__type__' in identity && identity.__type__ === 'ref') {
    const recruitDoc = await get(identity);

    if (!recruitDoc) {
      throw new Error(`구인구직을 찾지 못했습니다. id: ${identity.id}`);
    }

    recruit = recruitDoc.data;
  } else if ('__type__' in identity && identity.__type__ === 'doc') {
    recruit = identity.data;
  } else {
    recruit = identity;
  }

  return recruit;
}

export async function getReviewFromIdentity(identity: Identity<Review>): Promise<Review> {
  const reviewsColl = collection<Review>(REVIEW_COLLECTION_ID);

  let review: Review;

  if (typeof identity === 'string') {
    const reviewDoc = await get(reviewsColl, identity);

    if (!reviewDoc) {
      throw new Error(`후기를 찾지 못했습니다. id: ${identity}`);
    }

    review = reviewDoc.data;
  } else if ('__type__' in identity && identity.__type__ === 'ref') {
    const reviewDoc = await get(identity);

    if (!reviewDoc) {
      throw new Error(`후기를 찾지 못했습니다. id: ${identity.id}`);
    }

    review = reviewDoc.data;
  } else if ('__type__' in identity && identity.__type__ === 'doc') {
    review = identity.data;
  } else {
    review = identity;
  }

  return review;
}
