import { QueryDocumentSnapshot } from '@google-cloud/firestore';
import { Change } from 'firebase-functions';
import {
  RecruitDocData,
  pushOfferNotification, pushAcceptNotification, pushContractNotification, pushApplyNotification, wrapRecruit,
} from '../util';
import { uncheckOffers, uncheckApplicants, uncheckContracts } from '../../firestore';

export async function onCreateRecruit(createdRecruitDocSnap: QueryDocumentSnapshot): Promise<any> {
  const createdRecruitDocData = createdRecruitDocSnap.data() as RecruitDocData;
  const createdRecruit = wrapRecruit(createdRecruitDocData);

  /**
   * 작업요청
   */
  if (createdRecruit.isOffered) {
    return Promise.all([
      pushOfferNotification(createdRecruit.worker.id, createdRecruit),
      uncheckOffers(createdRecruit.worker.id),
    ]);
  }

  /**
   * 지원
   */
  return Promise.all([
    pushApplyNotification(createdRecruit.client.id, createdRecruit),
    uncheckApplicants(createdRecruit.work.id),
  ]);
}

export async function onUpdateRecruit({ before: beforeRecruitDocSnap, after: afterRecruitDocSnap }: Change<QueryDocumentSnapshot>): Promise<any> {
  const beforeRecruitDocData = beforeRecruitDocSnap.data() as RecruitDocData;
  const afterRecruitDocData = afterRecruitDocSnap.data() as RecruitDocData;

  const beforeRecruit = wrapRecruit(beforeRecruitDocData);
  const afterRecruit = wrapRecruit(afterRecruitDocData);

  /**
   * 실행 조건 확인용 데이터 준비
   */
  const isContracted = (!beforeRecruit.isContracted && afterRecruit.isContracted)
    && (afterRecruit.worker.contractCount - beforeRecruit.worker.contractCount >= 1);

  const isAccepted = !beforeRecruit.isAccepted && afterRecruit.isAccepted;

  if (!isContracted && !isAccepted) {
    return Promise.resolve();
  }

  const promises: Promise<any>[] = [];

  /**
   * 체결
   */
  if (isContracted) {
    promises.push(Promise.all([
      pushContractNotification(afterRecruit.worker.id, afterRecruit),
      uncheckContracts(afterRecruit.worker.id),
    ]));
  }

  /**
   * 지원 수락
   */
  if (isAccepted) {
    promises.push(pushAcceptNotification(afterRecruit.worker.id, afterRecruit));
  }

  return Promise.all(promises);
}
