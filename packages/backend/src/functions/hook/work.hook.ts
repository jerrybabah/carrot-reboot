import dayjs from 'dayjs';
import { QueryDocumentSnapshot } from '@google-cloud/firestore';
import { Change } from 'firebase-functions';
import {
  WorkDocData,
  pushWorkCreationNotification, wrapWork, sendWorkCreationMsg,
} from '../util';
import { syncWorkToRecruits, syncWorkToReviews, syncWorkStatusToRecruits, syncWorkContractToRecruits } from '../../firestore';

export async function onCreateWork(createdWorkDocSnap: QueryDocumentSnapshot): Promise<any> {
  if (!process.env.FIREBASE_CONFIG) {
    throw new Error('FIREBASE_CONFIG 환경변수 설정 안됨');
  }

  const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);

  const createdWorkDocData = createdWorkDocSnap.data() as WorkDocData;
  const createdWork = wrapWork(createdWorkDocData);

  const promises: Promise<any>[] = [
    pushWorkCreationNotification(createdWork),
  ];

  if (firebaseConfig.projectId === 'prod---carrot-reboot') {
    promises.push(
      sendWorkCreationMsg(createdWork),
    );
  }

  return Promise.all(promises);
}

export async function onUpdateWork({ before: beforeWorkDocSnap, after: afterWorkDocSnap }: Change<QueryDocumentSnapshot>): Promise<any> {
  const beforeWorkDocData = beforeWorkDocSnap.data() as WorkDocData;
  const afterWorkDocData = afterWorkDocSnap.data() as WorkDocData;

  const beforeWork = wrapWork(beforeWorkDocData);
  const afterWork = wrapWork(afterWorkDocData);

  /**
   * 실행 조건 확인용 데이터 준비
   */
  const isFieldChanged = beforeWork.field !== afterWork.field;

  const isStartDateChanged = !dayjs(beforeWork.startDate).isSame(afterWork.startDate);

  const isEndDateChanged = !dayjs(beforeWork.endDate).isSame(afterWork.endDate);

  const isAddress1Changed = beforeWork.address1 !== afterWork.address1;

  const isAddress2Changed = beforeWork.address2 !== afterWork.address2;

  const isAddressDetailChanged = beforeWork.addressDetail !== afterWork.addressDetail;

  const isRequiredWorkersChanged = beforeWork.requiredWorkers.length !== afterWork.requiredWorkers.length
    || beforeWork.requiredWorkers.some((beforeRequriedWorker, index) => (
      beforeRequriedWorker.type !== afterWork.requiredWorkers[index].type
        || beforeRequriedWorker.wage !== afterWork.requiredWorkers[index].wage
    ));

  const isTotalCostChanged = beforeWork.totalCost !== afterWork.totalCost;

  const isTitleChanged = beforeWork.title !== afterWork.title;

  const isWorkSubsetChanged = isFieldChanged
    || isStartDateChanged
    || isEndDateChanged
    || isAddress1Changed
    || isAddress2Changed
    || isAddressDetailChanged
    || isRequiredWorkersChanged
    || isTotalCostChanged
    || isTitleChanged;

  const isWorkStatusChanged = beforeWork.workStatus !== afterWork.workStatus;

  const isContractedChanged = beforeWork.isContracted !== afterWork.isContracted;

  if (!isWorkSubsetChanged && !isWorkStatusChanged && !isContractedChanged) {
    return Promise.resolve();
  }

  const promises: Promise<any>[] = [];

  /**
   * 기본 정보 변경
   */
  if (isWorkSubsetChanged) {
    promises.push(Promise.all([
      syncWorkToRecruits(afterWork),
      syncWorkToReviews(afterWork),
    ]));
  }

  /**
   * 일자리 상태 변경
   */
  if (isWorkStatusChanged) {
    promises.push(syncWorkStatusToRecruits(afterWork));
  }

  /**
   * 구인완료 상태 변경
   */
  if (isContractedChanged) {
    promises.push(syncWorkContractToRecruits(afterWork));
  }

  return Promise.all(promises);
}
