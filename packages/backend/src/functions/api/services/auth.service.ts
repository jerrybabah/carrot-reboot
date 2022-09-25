import createHttpError from 'http-errors';
import * as admin from 'firebase-admin';
import { sendSMS } from '../../util';
import { createPhoneNumberAuth, getPhoneNumberAuth } from '../../../firestore';

const testPhoneNumbers = [
  '01000000000',
  '01000000001',
  '01000000002',
  '01000000003',
  '01000000004',
  '01000000005',
  '01000000006',
  '01000000007',
  '01000000008',
  '01000000009',
  '01012345678',
];

export async function sendAuthNumber(phoneNumber: string, type: string): Promise<void> {
  if (testPhoneNumbers.some((testPhoneNumber) => testPhoneNumber === phoneNumber)) {
    return;
  }

  const authNumber = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

  await createPhoneNumberAuth(phoneNumber, authNumber, type);

  await sendSMS(phoneNumber, `[${authNumber}]김프로에서 보낸 인증번호입니다.`);
}

export async function authAuthNumber(phoneNumber: string, authNumber: string, type: string): Promise<string> {
  /**
   * 테스트 전화번호
   */
  if (testPhoneNumbers.some((testPhoneNumber) => testPhoneNumber === phoneNumber)) {
    if (authNumber !== '111111') {
      throw createHttpError(401, '인증번호가 일치하지 않습니다.');
    }
  /**
   * 실제 전화번호
   */
  } else {
    const phoneNumberAuth = await getPhoneNumberAuth(phoneNumber, type);

    if (!phoneNumberAuth) {
      throw createHttpError(404, '요청한 전화번호로 인증번호를 보낸 내역이 없습니다.');
    }

    if (phoneNumberAuth.authNumber !== authNumber) {
      throw createHttpError(401, '인증번호가 일치하지 않습니다.');
    }
  }

  const token = await admin.auth().createCustomToken(`${type}:${phoneNumber}`);
  return token;
}
