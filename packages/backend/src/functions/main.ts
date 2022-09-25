import 'dayjs/locale/ko';
import dayjs from 'dayjs';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import apiHandler from './api';
import * as batchHandlers from './batch';
import * as cronHandlers from './cron';
import * as hookHandlers from './hook';
import { CLIENT_COLLECTION_ID, WORKER_COLLECTION_ID, WORK_COLLECTION_ID, RECRUIT_COLLECTION_ID, REVIEW_COLLECTION_ID } from '../firestore';

const REGION = 'asia-northeast3';

dayjs.locale('ko');
admin.initializeApp();

export const api = functions.region(REGION).https.onRequest(apiHandler);

export const batch = {
  generateFake: functions.region(REGION).https.onRequest(batchHandlers.generateFake),
};

export const cron = {
  dailyJob: functions.region(REGION).pubsub.schedule('every day 00:00').timeZone('Asia/Seoul').onRun(cronHandlers.dailyJob),
};

export const hook = {
  onCreateClient: functions.region(REGION).firestore.document(`${CLIENT_COLLECTION_ID}/{clientId}`).onCreate(hookHandlers.onCreateClient),
  onCreateWorker: functions.region(REGION).firestore.document(`${WORKER_COLLECTION_ID}/{workerId}`).onCreate(hookHandlers.onCreateWorker),
  onUpdateWorker: functions.region(REGION).firestore.document(`${WORKER_COLLECTION_ID}/{workerId}`).onUpdate(hookHandlers.onUpdateWorker),
  onCreateWork: functions.region(REGION).firestore.document(`${WORK_COLLECTION_ID}/{workId}`).onCreate(hookHandlers.onCreateWork),
  onUpdateWork: functions.region(REGION).firestore.document(`${WORK_COLLECTION_ID}/{workId}`).onUpdate(hookHandlers.onUpdateWork),
  onCreateRecruit: functions.region(REGION).firestore.document(`${RECRUIT_COLLECTION_ID}/{recruitId}`).onCreate(hookHandlers.onCreateRecruit),
  onUpdateRecruit: functions.region(REGION).firestore.document(`${RECRUIT_COLLECTION_ID}/{recruitId}`).onUpdate(hookHandlers.onUpdateRecruit),
  onCreateReview: functions.region(REGION).firestore.document(`${REVIEW_COLLECTION_ID}/{reviewId}`).onCreate(hookHandlers.onCreateReview),
};
