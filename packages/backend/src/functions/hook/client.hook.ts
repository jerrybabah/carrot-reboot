import { QueryDocumentSnapshot } from '@google-cloud/firestore';
import {
  ClientDocData,
  wrapClient, sendClientCreationMsg,
} from '../util';

export async function onCreateClient(createdClientDocSnap: QueryDocumentSnapshot): Promise<any> {
  if (!process.env.FIREBASE_CONFIG) {
    throw new Error('FIREBASE_CONFIG 환경변수 설정 안됨');
  }

  const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);

  if (firebaseConfig.projectId === 'prod---carrot-reboot') {
    const createdClientDocData = createdClientDocSnap.data() as ClientDocData;

    const createdClient = wrapClient(createdClientDocData);

    return sendClientCreationMsg(createdClient);
  }

  return undefined;
}
