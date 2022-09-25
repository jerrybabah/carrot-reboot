import dayjs from 'dayjs';
import { difference } from 'lodash';
import * as admin from 'firebase-admin';
import {
  FIELDS,
  Worker, Recruit, Review, Work, Client, Identity,
  updateWorkerRegistrationToken, updateClientRegistrationToken, getClient, getWorker,
  getClientFromIdentity, getWorkFromIdentity, getWorkerFromIdentity, getRecruitFromIdentity, getReviewFromIdentity,
} from '../../firestore';

export async function pushOfferNotification(_worker: Identity<Worker>, _offer: Identity<Recruit>): Promise<void> {
  const [
    worker,
    offer,
  ] = await Promise.all([
    getWorkerFromIdentity(_worker),
    getRecruitFromIdentity(_offer),
  ]);

  if (!worker.registrationToken) {
    return;
  }

  const message: admin.messaging.Message = {
    token: worker.registrationToken,
    notification: {
      title: `[작업요청] ${offer.work.title}`,
      body: `분야: ${offer.work.field}\n`
        + `일시: ${dayjs(offer.work.startDate).format('YYYY-MM-DD')} ~ ${dayjs(offer.work.endDate).format('YYYY-MM-DD')}\n`
        + `장소: ${offer.work.address1} ${offer.work.address2} ${offer.work.addressDetail || ''}`,
    },
    data: {
      type: 'offer',
    },
  };

  try {
    await admin.messaging().send(message);
  } catch (e: any) {
    if (e.code === 'messaging/registration-token-not-registered') {
      await updateWorkerRegistrationToken(worker, null);
    }
  }
}

export async function pushAcceptNotification(_worker: Identity<Worker>, _application: Identity<Recruit>): Promise<void> {
  const [
    worker,
    application,
  ] = await Promise.all([
    getWorkerFromIdentity(_worker),
    getRecruitFromIdentity(_application),
  ]);

  if (!worker.registrationToken) {
    return;
  }

  const message: admin.messaging.Message = {
    token: worker.registrationToken,
    notification: {
      title: `[지원수락] ${application.work.title}`,
      body: `분야: ${application.work.field}\n`
        + `일시: ${dayjs(application.work.startDate).format('YYYY-MM-DD')} ~ ${dayjs(application.work.endDate).format('YYYY-MM-DD')}\n`
        + `장소: ${application.work.address1} ${application.work.address2} ${application.work.addressDetail || ''}`,
    },
    data: {
      type: 'accept',
    },
  };

  try {
    await admin.messaging().send(message);
  } catch (e: any) {
    if (e.code === 'messaging/registration-token-not-registered') {
      await updateWorkerRegistrationToken(worker, null);
    }
  }
}

export async function pushContractNotification(_worker: Identity<Worker>, _contract: Identity<Recruit>): Promise<void> {
  const [
    worker,
    contract,
  ] = await Promise.all([
    getWorkerFromIdentity(_worker),
    getRecruitFromIdentity(_contract),
  ]);

  if (!worker.registrationToken) {
    return;
  }

  const message: admin.messaging.Message = {
    token: worker.registrationToken,
    notification: {
      title: `[체결] ${contract.work.title}`,
      body: `분야: ${contract.work.field}\n`
        + `일시: ${dayjs(contract.work.startDate).format('YYYY-MM-DD')} ~ ${dayjs(contract.work.endDate).format('YYYY-MM-DD')}\n`
        + `장소: ${contract.work.address1} ${contract.work.address2} ${contract.work.addressDetail || ''}`,
    },
    data: {
      type: 'contract',
    },
  };

  try {
    await admin.messaging().send(message);
  } catch (e: any) {
    if (e.code === 'messaging/registration-token-not-registered') {
      await updateWorkerRegistrationToken(worker, null);
    }
  }
}

export async function pushReviewCreationNotification(_worker: Identity<Worker>, _review: Identity<Review>): Promise<void> {
  const [
    worker,
    review,
  ] = await Promise.all([
    getWorkerFromIdentity(_worker),
    getReviewFromIdentity(_review),
  ]);

  if (!worker.registrationToken) {
    return;
  }

  const message: admin.messaging.Message = {
    token: worker.registrationToken,
    notification: {
      title: `${worker.name} 기술자님에게 후기가 작성되었습니다.`,
      body: `${review.description.slice(0, 100)}`,
    },
    data: {
      type: 'reviewCreation',
    },
  };

  try {
    await admin.messaging().send(message);
  } catch (e: any) {
    if (e.code === 'messaging/registration-token-not-registered') {
      await updateWorkerRegistrationToken(worker, null);
    }
  }
}

export async function pushWorkCreationNotification(_work: Identity<Work>): Promise<void> {
  const work = await getWorkFromIdentity(_work);

  const fieldEng = Object.keys(FIELDS).find((fieldKey) => (FIELDS as any)[fieldKey] === work.field);

  if (!fieldEng) {
    return;
  }

  const message: admin.messaging.Message = {
    topic: fieldEng,
    notification: {
      title: `[새 일자리] ${work.title}`,
      body: `분야: ${work.field}\n`
        + `일시: ${dayjs(work.startDate).format('YYYY-MM-DD')} ~ ${dayjs(work.endDate).format('YYYY-MM-DD')}\n`
        + `장소: ${work.address1} ${work.address2} ${work.addressDetail || ''}`,
    },
    data: {
      type: 'workCreation',
      workId: `${work.id}`,
    },
  };

  await admin.messaging().send(message);
}

export async function pushApplyNotification(_client: Identity<Client>, _apply: Identity<Recruit>): Promise<void> {
  const [
    client,
    apply,
  ] = await Promise.all([
    getClientFromIdentity(_client),
    getRecruitFromIdentity(_apply),
  ]);

  if (!client.registrationToken) {
    return;
  }

  const message: admin.messaging.Message = {
    token: client.registrationToken,
    notification: {
      title: `[지원] ${apply.work.title}`,
      body: `이름: ${apply.worker.name}\n`
        + `전문분야: ${apply.worker.specialties.reduce((specialtiesString, specialty) => `${specialtiesString}, ${specialty}`)}\n`
        + `희망일당: ${Math.floor(apply.worker.minWage / 10000)} ~ ${Math.floor(apply.worker.maxWage / 10000)}만원`,
    },
    data: {
      type: 'apply',
      workId: apply.work.id,
    },
  };

  try {
    await admin.messaging().send(message);
  } catch (e: any) {
    if (e.code === 'messaging/registration-token-not-registered') {
      await updateClientRegistrationToken(client, null);
    }
  }
}

export async function pushChatNotification(reader: 'Client' | 'Worker', _recruit: Identity<Recruit>, messageBody: string): Promise<void> {
  const recruit = await getRecruitFromIdentity(_recruit);

  let user: Client | Worker | null;

  if (reader === 'Client') {
    user = await getClient(recruit.client.id);
  } else {
    user = await getWorker(recruit.worker.id);
  }

  if (!user || !user.registrationToken) {
    return;
  }

  const message: admin.messaging.Message = {
    token: user.registrationToken,
    notification: {
      title: '채팅 알림',
      body: `${reader === 'Client' ? recruit.worker.name : recruit.client.name}: ${messageBody.slice(0, 100)}`,
    },
    data: {
      type: 'chat',
      workId: recruit.work.id,
      recruitId: recruit.id,
    },
  };

  try {
    await admin.messaging().send(message);
  } catch (e: any) {
    if (e.code === 'messaging/registration-token-not-registered') {
      if (reader === 'Client') {
        await updateClientRegistrationToken(recruit.client.id, null);
      } else {
        await updateWorkerRegistrationToken(recruit.worker.id, null);
      }
    }
  }
}

export async function subscribeSpecialties(token: string, specialties: string[]): Promise<void> {
  await Promise.all(specialties.map(async (specialty) => {
    const specialtyEng = Object.keys(FIELDS).find((fieldEng) => (FIELDS as any)[fieldEng] === specialty);

    if (!specialtyEng) {
      return;
    }

    await admin.messaging().subscribeToTopic(token, specialtyEng);
  }));
}

export async function unsubscribeSpecialties(token: string, specialties: string[]): Promise<void> {
  await Promise.all(specialties.map<Promise<void>>(async (specialty) => {
    const specialtyEng = Object.keys(FIELDS).find((fieldEng) => (FIELDS as any)[fieldEng] === specialty);

    if (!specialtyEng) {
      return;
    }

    await admin.messaging().unsubscribeFromTopic(token, specialtyEng);
  }));
}

export async function updateSpecialtySubscriptionsOfToken(token: string, beforeSpecialties: string[], afterSpecialties: string[]): Promise<void> {
  const removedSpecialties = difference(beforeSpecialties, afterSpecialties);
  const addedSpecialties = difference(afterSpecialties, beforeSpecialties);

  await Promise.all([
    unsubscribeSpecialties(token, removedSpecialties),
    subscribeSpecialties(token, addedSpecialties),
  ]);
}

export async function updateTokenToSubscribeSpecialties(specialties: string[], beforeToken: string | null, afterToken: string | null): Promise<void> {
  /**
   * 토큰이 새로 생기는 경우
   */
  if (!beforeToken && afterToken) {
    await subscribeSpecialties(afterToken, specialties);
  /**
   * 새로운 토큰으로 갱신된 경우
   */
  } else if (beforeToken && afterToken) {
    await Promise.all([
      unsubscribeSpecialties(beforeToken, specialties),
      subscribeSpecialties(afterToken, specialties),
    ]);
  /**
   * 토큰을 삭제한 경우
   */
  } else if (beforeToken && !afterToken) {
    await unsubscribeSpecialties(beforeToken, specialties);
  } else {
    // token이 없는 경우에는 무시한다.
  }
}
