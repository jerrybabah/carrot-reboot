import { collection, id, set, query, where, order, limit } from 'typesaurus';
import {
  PhoneNumberAuth,
  PHONE_NUMBER_AUTH_COLLECTION_ID,
} from '../model';

export async function createPhoneNumberAuth(phoneNumber: string, authNumber: string, type: string): Promise<void> {
  const phoneNumberAuthColl = collection<PhoneNumberAuth>(PHONE_NUMBER_AUTH_COLLECTION_ID);

  const phoneNumberAuthId = await id();

  const tenMinutesLater = new Date();
  tenMinutesLater.setMinutes(tenMinutesLater.getMinutes() + 10);

  await set(phoneNumberAuthColl, phoneNumberAuthId, {
    id: phoneNumberAuthId,
    phoneNumber,
    authNumber,
    type,
    expirationTime: tenMinutesLater,
  });
}

export async function getPhoneNumberAuth(phoneNumber: string, type: string): Promise<PhoneNumberAuth | null> {
  const phoneNumberAuthColl = collection<PhoneNumberAuth>(PHONE_NUMBER_AUTH_COLLECTION_ID);

  const phoneNumberAuthDocs = await query(phoneNumberAuthColl, [
    where('phoneNumber', '==', phoneNumber),
    where('type', '==', type),
    order('expirationTime', 'desc'),
    limit(1),
  ]);

  return phoneNumberAuthDocs.length > 0 ? phoneNumberAuthDocs[0].data : null;
}
