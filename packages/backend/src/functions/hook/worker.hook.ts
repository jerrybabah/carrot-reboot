import dayjs from 'dayjs';
import { QueryDocumentSnapshot } from '@google-cloud/firestore';
import { Change } from 'firebase-functions';
import {
  WorkerDocData,
  updateSpecialtySubscriptionsOfToken, updateTokenToSubscribeSpecialties, wrapWorker, sendWorkerCreationMsg,
} from '../util';
import {
  syncWorkerToRecruits, syncWorkerToReviews, syncWorkerToFavoriteWorkers, syncWorkerToSpecialtyWorkers,
  syncWorkerLastUpdateToSpecialWorkers,
  syncWorkerActiveToFavoriteWorkers, syncWorkerActiveToSpecialtyWorkers,
  syncWorkerReviewToRecruits, syncWorkerReviewToFavoriteWorkers, syncWorkerReviewToSpecialWorkers,
  syncWorkerContractToRecruits, syncWorkerContractToFavoriteWorkers, syncWorkerContractToSpecialtyWorkers,
} from '../../firestore';

export async function onCreateWorker(createdWorkerDocSnap: QueryDocumentSnapshot): Promise<any> {
  if (!process.env.FIREBASE_CONFIG) {
    throw new Error('FIREBASE_CONFIG 환경변수 설정 안됨');
  }

  const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);

  if (firebaseConfig.projectId === 'prod---carrot-reboot') {
    const createdWorkerDocData = createdWorkerDocSnap.data() as WorkerDocData;

    const createdWorker = wrapWorker(createdWorkerDocData);

    return sendWorkerCreationMsg(createdWorker);
  }

  return undefined;
}

export async function onUpdateWorker({ before: beforeWorkerDocSnap, after: afterWorkerDocSnap }: Change<QueryDocumentSnapshot>): Promise<any> {
  const beforeWorkerDocData = beforeWorkerDocSnap.data() as WorkerDocData;
  const afterWorkerDocData = afterWorkerDocSnap.data() as WorkerDocData;

  const beforeWorker = wrapWorker(beforeWorkerDocData);
  const afterWorker = wrapWorker(afterWorkerDocData);

  /**
   * 실행 조건 확인용 데이터 준비
   */
  const isProfileImageChanged = beforeWorker.profileImage !== afterWorker.profileImage;

  beforeWorker.specialties.sort();
  afterWorker.specialties.sort();

  const isSpecialtiesChanged = beforeWorker.specialties.length !== afterWorker.specialties.length
    || beforeWorker.specialties.some((beforeWorkerSpecialty, index) => beforeWorkerSpecialty !== afterWorker.specialties[index]);

  const isNameChanged = beforeWorker.name !== afterWorker.name;

  const isPhoneNumberChanged = beforeWorker.phoneNumber !== afterWorker.phoneNumber;

  const isMinWageChanged = beforeWorker.minWage !== afterWorker.minWage;

  const isMaxWageChanged = beforeWorker.maxWage !== afterWorker.maxWage;

  const isDistrictsChanged = Object.entries(beforeWorker.districts).some(([beforeLargeDistrict, beforeSmallDistrcits]) => {
    // 시, 도 단위의 지역이 새로 생겼거나 없어졌으면 바뀐 것.
    if (!afterWorker.districts[beforeLargeDistrict]) {
      return true;
    }

    beforeSmallDistrcits.sort();
    afterWorker.districts[beforeLargeDistrict].sort();

    // 시, 도 단위 지역은 바뀐 게 없지만 시, 군, 구 단위의 지역이 새로 생겼거나 없어졌으면 바뀐 것.
    return beforeSmallDistrcits.some((beforeSmallDistrict, index) => beforeSmallDistrict !== afterWorker.districts[beforeLargeDistrict][index]);
  });

  const isWorkerSubsetChanged = isProfileImageChanged
    || isSpecialtiesChanged
    || isNameChanged
    || isPhoneNumberChanged
    || isMinWageChanged
    || isMaxWageChanged
    || isDistrictsChanged;

  const isLastUpdateChanged = !dayjs(beforeWorker.updatedAt).isSame(afterWorker.updatedAt);

  const isIsActiveChanged = beforeWorker.isActive !== afterWorker.isActive;

  const isReviewChanged = beforeWorker.reviewCount !== afterWorker.reviewCount
    || beforeWorker.averageScore !== afterWorker.averageScore;

  const isContractCountChanged = beforeWorker.contractCount !== afterWorker.contractCount;

  const isRegistrationTokenChanged = beforeWorker.registrationToken !== afterWorker.registrationToken;

  if (
    !isWorkerSubsetChanged
    && !isLastUpdateChanged
    && !isIsActiveChanged
    && !isReviewChanged
    && !isContractCountChanged
    && !isRegistrationTokenChanged
  ) {
    return Promise.resolve();
  }

  const promises: Promise<any>[] = [];

  if (isWorkerSubsetChanged) {
    promises.push(Promise.all([
      syncWorkerToRecruits(afterWorker),
      syncWorkerToReviews(afterWorker),
      syncWorkerToFavoriteWorkers(afterWorker),
      syncWorkerToSpecialtyWorkers(afterWorker),
    ]));
  } else if (isLastUpdateChanged) {
    promises.push(syncWorkerLastUpdateToSpecialWorkers(afterWorker));
  }

  if (isIsActiveChanged) {
    promises.push(Promise.all([
      syncWorkerActiveToFavoriteWorkers(afterWorker),
      syncWorkerActiveToSpecialtyWorkers(afterWorker),
    ]));
  }

  if (isReviewChanged) {
    promises.push(Promise.all([
      syncWorkerReviewToRecruits(afterWorker),
      syncWorkerReviewToFavoriteWorkers(afterWorker),
      syncWorkerReviewToSpecialWorkers(afterWorker),
    ]));
  }

  if (isContractCountChanged) {
    promises.push(Promise.all([
      syncWorkerContractToRecruits(afterWorker),
      syncWorkerContractToFavoriteWorkers(afterWorker),
      syncWorkerContractToSpecialtyWorkers(afterWorker),
    ]));
  }

  /**
   * 전문분야가 바뀜, 토큰 변경되지 않음, 토큰이 존재함
   */
  if (isSpecialtiesChanged && !isRegistrationTokenChanged && afterWorker.registrationToken !== null) {
    promises.push(
      updateSpecialtySubscriptionsOfToken(afterWorker.registrationToken, beforeWorker.specialties, afterWorker.specialties),
    );
  /**
   * 전문분야 바뀌지 않음, 토큰 변경됨
   */
  } else if (!isSpecialtiesChanged && isRegistrationTokenChanged) {
    promises.push(
      updateTokenToSubscribeSpecialties(afterWorker.specialties, beforeWorker.registrationToken, afterWorker.registrationToken),
    );
  }

  return Promise.all(promises);
}
