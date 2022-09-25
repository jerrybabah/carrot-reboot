import { difference } from 'lodash';
import {
  collection, get, query, where, limit, id, value, update, order, startAfter, batch, field, subcollection, group,
  Cursor, Query, UpdateValue, Ref,
} from 'typesaurus';
import { Pagination, WorkerCreationValue, WorkerModificationValue, WorkerListFilter } from './type';
import { firestoreConfig } from './config';
import {
  WORKER_COLLECTION_ID, SPECIALTY_COLLECTION_ID, SPECIALTY_WORKER_COLLECTION_ID, RECRUIT_COLLECTION_ID, REVIEW_COLLECTION_ID, FAVORITE_WORKER_COLLECTION_ID, CLIENT_COLLECTION_ID,
  Worker, SpecialtyWorker, Recruit, Review, FavoriteWorker, Client, Identity,
  mapLargeToHuge, getIdFromIdentity, getWorkerFromIdentity,
} from '../model';

export async function getActiveWorkersGroupBySpecialty(
  specialty: string, filter?: WorkerListFilter, cursor?: Cursor<SpecialtyWorker, keyof SpecialtyWorker> | null,
): Promise<Pagination<SpecialtyWorker>> {
  const specialtyWorkersColl = collection<SpecialtyWorker>(`${SPECIALTY_COLLECTION_ID}/${specialty}/${SPECIALTY_WORKER_COLLECTION_ID}`);

  const queries: Query<SpecialtyWorker, keyof SpecialtyWorker>[] = [
    where('isActive', '==', true),
  ];

  if (filter?.address) {
    queries.push(
      where(['districts', filter.address.address1], 'array-contains', filter.address.address2),
    );
  }

  queries.push(
    order('updatedAt', 'desc', cursor ? [cursor] : undefined),
    limit(firestoreConfig.workersPerPage),
  );

  const specialtyWorkerDocs = await query(specialtyWorkersColl, queries);

  return {
    list: specialtyWorkerDocs.map((specialtyWorkerDoc) => specialtyWorkerDoc.data),
    cursor: specialtyWorkerDocs.length > 0 ? startAfter(specialtyWorkerDocs[specialtyWorkerDocs.length - 1]) : null,
  };
}

export async function getWorker(workerId: string): Promise<Worker | null> {
  const workersColl = collection<Worker>(WORKER_COLLECTION_ID);

  const workerDoc = await get(workersColl, workerId);

  return workerDoc ? workerDoc.data : null;
}

export async function getWorkerByPhoneNumber(phoneNumber: string): Promise<Worker | null> {
  const workersColl = collection<Worker>(WORKER_COLLECTION_ID);

  const workerDocs = await query(workersColl, [
    where('phoneNumber', '==', phoneNumber),
    limit(1),
  ]);

  return workerDocs.length > 0 ? workerDocs[0].data : null;
}

export async function createWorker(workerValue: WorkerCreationValue): Promise<string> {
  const workersColl = collection<Worker>(WORKER_COLLECTION_ID);

  const workerId = await id();

  const threeYearsLater = new Date();
  threeYearsLater.setMonth(threeYearsLater.getMonth() + 36);

  const hugeDistricts = new Set<string>();

  Object.keys(workerValue.districts).forEach((largeDistrict) => {
    hugeDistricts.add(mapLargeToHuge(largeDistrict));
  });

  const b = batch();

  b.set(workersColl, workerId, {
    id: workerId,
    createdAt: value('serverDate'),
    updatedAt: value('serverDate'),
    profileImage: workerValue.profileImage || null,
    certificateImage: workerValue.certificateImage,
    specialties: workerValue.specialties,
    name: workerValue.name,
    totalScore: 0,
    averageScore: 0,
    reviewCount: 0,
    contractCount: 0,
    portfolioCount: 0,
    favoriterCount: 0,
    career: workerValue.career,
    minWage: workerValue.minWage,
    maxWage: workerValue.maxWage,
    phoneNumber: workerValue.phoneNumber,
    hugeDistricts: Array.from(hugeDistricts).sort(),
    districts: workerValue.districts,
    description: workerValue.description,
    expirationDate: threeYearsLater,
    isActive: true,
    haveUncheckedOffers: false,
    haveUncheckedContracts: false,
    registrationToken: null,
  });

  await Promise.all(workerValue.specialties.map(async (specialty) => {
    const specialtyWorkersColl = collection<SpecialtyWorker>(`${SPECIALTY_COLLECTION_ID}/${specialty}/${SPECIALTY_WORKER_COLLECTION_ID}`);

    const specialtyWorkerId = await id();

    b.set(specialtyWorkersColl, specialtyWorkerId, {
      id: specialtyWorkerId,
      workerId,
      createdAt: value('serverDate'),
      updatedAt: value('serverDate'),
      expirationDate: threeYearsLater,
      isActive: true,
      hugeDistricts: Array.from(hugeDistricts).sort(),
      districts: workerValue.districts,
      profileImage: workerValue.profileImage || null,
      specialties: workerValue.specialties,
      name: workerValue.name,
      phoneNumber: workerValue.phoneNumber,
      averageScore: 0,
      reviewCount: 0,
      contractCount: 0,
      minWage: workerValue.minWage,
      maxWage: workerValue.maxWage,
    });
  }));

  await b.commit();

  return workerId;
}

export async function updateWorker(_worker: Identity<Worker>, workerValue: WorkerModificationValue): Promise<void> {
  const workersColl = collection<Worker>(WORKER_COLLECTION_ID);

  const workerId = getIdFromIdentity(_worker);
  const worker = await getWorkerFromIdentity(_worker);

  type UpdateModel<Model> = {
    [Key in keyof Model]?: UpdateModel<Model[Key]> | UpdateValue<Model[Key]>
  };

  const updatedData: UpdateModel<Worker> = {
    ...workerValue,
    updatedAt: value('serverDate'),
  };

  let isDistrictsChanged = false;
  let hugeDistricts: string[] = [];

  if (workerValue.districts) {
    isDistrictsChanged = Object.entries(worker.districts).some(([beforeLargeDistrict, beforeSmallDistrcits]) => {
      // 시, 도 단위의 지역이 새로 생겼거나 없어졌으면 바뀐 것.
      if (!workerValue.districts![beforeLargeDistrict]) {
        return true;
      }

      beforeSmallDistrcits.sort();
      workerValue.districts![beforeLargeDistrict].sort();

      // 시, 도 단위 지역은 바뀐 게 없지만 시, 군, 구 단위의 지역이 새로 생겼거나 없어졌으면 바뀐 것.
      return beforeSmallDistrcits.some((beforeSmallDistrict, index) => beforeSmallDistrict !== workerValue.districts![beforeLargeDistrict][index]);
    });
  }

  if (isDistrictsChanged) {
    const hugeDistrictSet = new Set<string>();

    Object.keys(workerValue.districts!).forEach((largeDistrict) => {
      hugeDistrictSet.add(mapLargeToHuge(largeDistrict));
    });

    hugeDistricts = Array.from(hugeDistrictSet).sort();

    updatedData.hugeDistricts = hugeDistricts;
  }

  let isSpecialtiesChanged = false;

  if (workerValue.specialties) {
    worker.specialties.sort();
    workerValue.specialties!.sort();

    isSpecialtiesChanged = worker.specialties.length !== workerValue.specialties!.length
      || worker.specialties.some((beforeWorkerSpecialty, index) => beforeWorkerSpecialty !== workerValue.specialties![index]);
  }

  const b = batch();

  if (isSpecialtiesChanged) {
    const removedSpecialties = difference(worker.specialties, workerValue.specialties!);
    const addedSpecialties = difference(workerValue.specialties!, worker.specialties);

    // 이전의 전문분야 컬렉션에서 삭제
    const removedSpecialtyWorkerRefs = await Promise.all(removedSpecialties.map<Promise<Ref<SpecialtyWorker> | null>>(async (removedSpecialty) => {
      const specialtyWorkersColl = collection<SpecialtyWorker>(`${SPECIALTY_COLLECTION_ID}/${removedSpecialty}/${SPECIALTY_WORKER_COLLECTION_ID}`);

      const removedSpecialtyWorkerDocs = await query(specialtyWorkersColl, [
        where('workerId', '==', workerId),
        limit(1),
      ]);

      if (removedSpecialtyWorkerDocs.length === 0) {
        return null;
      }

      return removedSpecialtyWorkerDocs[0].ref;
    }));

    removedSpecialtyWorkerRefs.forEach((removedSpecialtyWorkerRef) => {
      if (removedSpecialtyWorkerRef) {
        b.remove(removedSpecialtyWorkerRef);
      }
    });

    // 새로운 전문분야 컬렉션에 추가
    await Promise.all(addedSpecialties.map(async (addedSpecialty) => {
      const specialtyWorkersColl = collection<SpecialtyWorker>(`${SPECIALTY_COLLECTION_ID}/${addedSpecialty}/${SPECIALTY_WORKER_COLLECTION_ID}`);

      const specialtyWorkerId = await id();

      b.set(specialtyWorkersColl, specialtyWorkerId, {
        id: specialtyWorkerId,
        workerId,
        createdAt: worker.createdAt,
        updatedAt: worker.updatedAt,
        expirationDate: worker.expirationDate,
        isActive: worker.isActive,
        hugeDistricts: isDistrictsChanged ? hugeDistricts : worker.hugeDistricts,
        districts: workerValue.districts || worker.districts,
        profileImage: workerValue.profileImage || worker.profileImage,
        specialties: workerValue.specialties!,
        name: workerValue.name || worker.name,
        phoneNumber: workerValue.phoneNumber || worker.phoneNumber,
        averageScore: worker.averageScore,
        reviewCount: worker.reviewCount,
        contractCount: worker.contractCount,
        minWage: workerValue.minWage || worker.minWage,
        maxWage: workerValue.maxWage || worker.maxWage,
      });
    }));
  }

  b.update(workersColl, workerId, updatedData);

  await b.commit();
}

export async function updateWorkerRegistrationToken(worker: Identity<Worker>, registrationToken: string | null): Promise<void> {
  const workersColl = collection<Worker>(WORKER_COLLECTION_ID);

  const workerId = getIdFromIdentity(worker);

  await update(workersColl, workerId, {
    registrationToken,
  });
}

export async function checkOffers(worker: Identity<Worker>): Promise<void> {
  const workersColl = collection<Worker>(WORKER_COLLECTION_ID);

  const workerId = getIdFromIdentity(worker);

  await update(workersColl, workerId, {
    haveUncheckedOffers: false,
  });
}

export async function uncheckOffers(worker: Identity<Worker>): Promise<void> {
  const workersColl = collection<Worker>(WORKER_COLLECTION_ID);

  const workerId = getIdFromIdentity(worker);

  await update(workersColl, workerId, {
    haveUncheckedOffers: true,
  });
}

export async function checkContracts(worker: Identity<Worker>): Promise<void> {
  const workersColl = collection<Worker>(WORKER_COLLECTION_ID);

  const workerId = getIdFromIdentity(worker);

  await update(workersColl, workerId, {
    haveUncheckedContracts: false,
  });
}

export async function uncheckContracts(worker: Identity<Worker>): Promise<void> {
  const workersColl = collection<Worker>(WORKER_COLLECTION_ID);

  const workerId = getIdFromIdentity(worker);

  await update(workersColl, workerId, {
    haveUncheckedContracts: true,
  });
}

export async function syncWorkerToRecruits(_worker: Identity<Worker>): Promise<void> {
  const worker = await getWorkerFromIdentity(_worker);

  const recruitsColl = collection<Recruit>(RECRUIT_COLLECTION_ID);

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const recruitDocs = await query(recruitsColl, [
    where('worker.id', '==', worker.id),
    where('createdAt', '>=', oneMonthAgo),
  ]);

  const b = batch();

  recruitDocs.forEach((recruitDoc) => {
    b.update(recruitDoc.ref, [
      field(['worker', 'profileImage'], worker.profileImage),
      field(['worker', 'specialties'], worker.specialties),
      field(['worker', 'name'], worker.name),
      field(['worker', 'phoneNumber'], worker.phoneNumber),
      field(['worker', 'minWage'], worker.minWage),
      field(['worker', 'maxWage'], worker.maxWage),
      field(['worker', 'hugeDistricts'], worker.hugeDistricts),
      field(['worker', 'districts'], worker.districts),
    ]);
  });

  await b.commit();
}

export async function syncWorkerToReviews(_worker: Identity<Worker>): Promise<void> {
  const worker = await getWorkerFromIdentity(_worker);

  const reviewsColl = collection<Review>(REVIEW_COLLECTION_ID);

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const reviewDocs = await query(reviewsColl, [
    where('worker.id', '==', worker.id),
    where('createdAt', '>=', oneMonthAgo),
  ]);

  const b = batch();

  reviewDocs.forEach((reviewDoc) => {
    b.update(reviewDoc.ref, [
      field(['worker', 'profileImage'], worker.profileImage),
      field(['worker', 'specialties'], worker.specialties),
      field(['worker', 'name'], worker.name),
      field(['worker', 'phoneNumber'], worker.phoneNumber),
      field(['worker', 'minWage'], worker.minWage),
      field(['worker', 'maxWage'], worker.maxWage),
      field(['worker', 'hugeDistricts'], worker.hugeDistricts),
      field(['worker', 'districts'], worker.districts),
    ]);
  });

  await b.commit();
}

export async function syncWorkerToFavoriteWorkers(_worker: Identity<Worker>): Promise<void> {
  const worker = await getWorkerFromIdentity(_worker);

  const favoritesColl = group(FAVORITE_WORKER_COLLECTION_ID, [
    subcollection<FavoriteWorker, Client>(
      FAVORITE_WORKER_COLLECTION_ID,
      collection<Client>(CLIENT_COLLECTION_ID),
    ),
  ]);

  const favoriteDocs = await query(favoritesColl, [
    where('workerId', '==', worker.id),
  ]);

  const b = batch();

  favoriteDocs.forEach((favoriteDoc) => {
    b.update(favoriteDoc.ref, {
      profileImage: worker.profileImage,
      specialties: worker.specialties,
      name: worker.name,
      phoneNumber: worker.phoneNumber,
      minWage: worker.minWage,
      maxWage: worker.maxWage,
      hugeDistricts: worker.hugeDistricts,
      districts: worker.districts,
    });
  });

  await b.commit();
}

export async function syncWorkerToSpecialtyWorkers(_worker: Identity<Worker>): Promise<void> {
  const worker = await getWorkerFromIdentity(_worker);

  const specialtyWorkersColl = group(SPECIALTY_WORKER_COLLECTION_ID, [
    subcollection<SpecialtyWorker, never>(
      SPECIALTY_WORKER_COLLECTION_ID,
      collection<never>(SPECIALTY_COLLECTION_ID),
    ),
  ]);

  const specialtyWorkerDocs = await query(specialtyWorkersColl, [
    where('workerId', '==', worker.id),
  ]);

  const b = batch();

  specialtyWorkerDocs.forEach((specialtyWorkerDoc) => {
    b.update(specialtyWorkerDoc.ref, {
      profileImage: worker.profileImage,
      specialties: worker.specialties,
      name: worker.name,
      phoneNumber: worker.phoneNumber,
      minWage: worker.minWage,
      maxWage: worker.maxWage,
      hugeDistricts: worker.hugeDistricts,
      districts: worker.districts,
      updatedAt: worker.updatedAt,
    });
  });

  await b.commit();
}

export async function syncWorkerActiveToFavoriteWorkers(_worker: Identity<Worker>): Promise<void> {
  const worker = await getWorkerFromIdentity(_worker);

  const favoritesColl = group(FAVORITE_WORKER_COLLECTION_ID, [
    subcollection<FavoriteWorker, Client>(
      FAVORITE_WORKER_COLLECTION_ID,
      collection<Client>(CLIENT_COLLECTION_ID),
    ),
  ]);

  const favoriteDocs = await query(favoritesColl, [
    where('workerId', '==', worker.id),
  ]);

  const b = batch();

  favoriteDocs.forEach((favoriteDoc) => {
    b.update(favoriteDoc.ref, {
      isActive: worker.isActive,
      expirationDate: worker.expirationDate,
    });
  });

  await b.commit();
}

export async function syncWorkerActiveToSpecialtyWorkers(_worker: Identity<Worker>): Promise<void> {
  const worker = await getWorkerFromIdentity(_worker);

  const specialtyWorkersColl = group(SPECIALTY_WORKER_COLLECTION_ID, [
    subcollection<SpecialtyWorker, never>(
      SPECIALTY_WORKER_COLLECTION_ID,
      collection<never>(SPECIALTY_COLLECTION_ID),
    ),
  ]);

  const specialtyWorkerDocs = await query(specialtyWorkersColl, [
    where('workerId', '==', worker.id),
  ]);

  const b = batch();

  specialtyWorkerDocs.forEach((specialtyWorkerDoc) => {
    b.update(specialtyWorkerDoc.ref, {
      isActive: worker.isActive,
      expirationDate: worker.expirationDate,
    });
  });

  await b.commit();
}

export async function syncWorkerContractToRecruits(_worker: Identity<Worker>): Promise<void> {
  const worker = await getWorkerFromIdentity(_worker);

  const recruitsColl = collection<Recruit>(RECRUIT_COLLECTION_ID);

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const recruitDocs = await query(recruitsColl, [
    where('worker.id', '==', worker.id),
    where('createdAt', '>=', oneMonthAgo),
  ]);

  const b = batch();

  recruitDocs.forEach((recruitDoc) => {
    b.update(recruitDoc.ref, [
      field(['worker', 'contractCount'], worker.contractCount),
    ]);
  });

  await b.commit();
}

export async function syncWorkerContractToFavoriteWorkers(_worker: Identity<Worker>): Promise<void> {
  const worker = await getWorkerFromIdentity(_worker);

  const favoritesColl = group(FAVORITE_WORKER_COLLECTION_ID, [
    subcollection<FavoriteWorker, Client>(
      FAVORITE_WORKER_COLLECTION_ID,
      collection<Client>(CLIENT_COLLECTION_ID),
    ),
  ]);

  const favoriteDocs = await query(favoritesColl, [
    where('workerId', '==', worker.id),
  ]);

  const b = batch();

  favoriteDocs.forEach((favoriteDoc) => {
    b.update(favoriteDoc.ref, {
      contractCount: worker.contractCount,
    });
  });

  await b.commit();
}

export async function syncWorkerContractToSpecialtyWorkers(_worker: Identity<Worker>): Promise<void> {
  const worker = await getWorkerFromIdentity(_worker);

  const specialtyWorkersColl = group(SPECIALTY_WORKER_COLLECTION_ID, [
    subcollection<SpecialtyWorker, never>(
      SPECIALTY_WORKER_COLLECTION_ID,
      collection<never>(SPECIALTY_COLLECTION_ID),
    ),
  ]);

  const specialtyWorkerDocs = await query(specialtyWorkersColl, [
    where('workerId', '==', worker.id),
  ]);

  const b = batch();

  specialtyWorkerDocs.forEach((specialtyWorkerDoc) => {
    b.update(specialtyWorkerDoc.ref, {
      contractCount: worker.contractCount,
    });
  });

  await b.commit();
}

export async function syncWorkerReviewToRecruits(_worker: Identity<Worker>): Promise<void> {
  const worker = await getWorkerFromIdentity(_worker);

  const recruitsColl = collection<Recruit>(RECRUIT_COLLECTION_ID);

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const recruitDocs = await query(recruitsColl, [
    where('worker.id', '==', worker.id),
    where('createdAt', '>=', oneMonthAgo),
  ]);

  const b = batch();

  recruitDocs.forEach((recruitDoc) => {
    b.update(recruitDoc.ref, [
      field(['worker', 'reviewCount'], worker.reviewCount),
      field(['worker', 'averageScore'], worker.averageScore),
    ]);
  });

  await b.commit();
}

export async function syncWorkerReviewToFavoriteWorkers(_worker: Identity<Worker>): Promise<void> {
  const worker = await getWorkerFromIdentity(_worker);

  const favoritesColl = group(FAVORITE_WORKER_COLLECTION_ID, [
    subcollection<FavoriteWorker, Client>(
      FAVORITE_WORKER_COLLECTION_ID,
      collection<Client>(CLIENT_COLLECTION_ID),
    ),
  ]);

  const favoriteDocs = await query(favoritesColl, [
    where('workerId', '==', worker.id),
  ]);

  const b = batch();

  favoriteDocs.forEach((favoriteDoc) => {
    b.update(favoriteDoc.ref, {
      reviewCount: worker.reviewCount,
      averageScore: worker.averageScore,
    });
  });

  await b.commit();
}

export async function syncWorkerReviewToSpecialWorkers(_worker: Identity<Worker>): Promise<void> {
  const worker = await getWorkerFromIdentity(_worker);

  const specialtyWorkersColl = group(SPECIALTY_WORKER_COLLECTION_ID, [
    subcollection<SpecialtyWorker, never>(
      SPECIALTY_WORKER_COLLECTION_ID,
      collection<never>(SPECIALTY_COLLECTION_ID),
    ),
  ]);

  const specialtyWorkerDocs = await query(specialtyWorkersColl, [
    where('workerId', '==', worker.id),
  ]);

  const b = batch();

  specialtyWorkerDocs.forEach((specialtyWorkerDoc) => {
    b.update(specialtyWorkerDoc.ref, {
      reviewCount: worker.reviewCount,
      averageScore: worker.averageScore,
    });
  });

  await b.commit();
}

export async function syncWorkerLastUpdateToSpecialWorkers(_worker: Identity<Worker>): Promise<void> {
  const worker = await getWorkerFromIdentity(_worker);

  const specialtyWorkersColl = group(SPECIALTY_WORKER_COLLECTION_ID, [
    subcollection<SpecialtyWorker, never>(
      SPECIALTY_WORKER_COLLECTION_ID,
      collection<never>(SPECIALTY_COLLECTION_ID),
    ),
  ]);

  const specialtyWorkerDocs = await query(specialtyWorkersColl, [
    where('workerId', '==', worker.id),
  ]);

  const b = batch();

  specialtyWorkerDocs.forEach((specialtyWorkerDoc) => {
    b.update(specialtyWorkerDoc.ref, {
      updatedAt: worker.updatedAt,
    });
  });

  await b.commit();
}

export async function expireWorkers(): Promise<void> {
  const workersColl = collection<Worker>(WORKER_COLLECTION_ID);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const justExpiredWorkerDocs = await query(workersColl, [
    where('isActive', '==', true),
    where('expirationDate', '<', tomorrow),
  ]);

  const b = batch();

  justExpiredWorkerDocs.forEach((justExpiredWorkerDoc) => {
    b.update(justExpiredWorkerDoc.ref, {
      isActive: false,
    });
  });

  await b.commit();
}
