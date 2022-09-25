import { collection, get, query, where, limit, set, id, value, update } from 'typesaurus';
import { ClientCreationValue, ClientModificationValue } from './type';
import {
  CLIENT_COLLECTION_ID,
  Client, Identity,
  getIdFromIdentity,
} from '../model';

export async function getClient(clientId: string): Promise<Client | null> {
  const clientsColl = collection<Client>(CLIENT_COLLECTION_ID);

  const clientDoc = await get(clientsColl, clientId);

  return clientDoc ? clientDoc.data : null;
}

export async function getClientByPhoneNumber(phoneNumber: string): Promise<Client | null> {
  const clientsColl = collection<Client>(CLIENT_COLLECTION_ID);

  const clientDocs = await query(clientsColl, [
    where('phoneNumber', '==', phoneNumber),
    limit(1),
  ]);

  return clientDocs.length > 0 ? clientDocs[0].data : null;
}

export async function createClient(clientValue: ClientCreationValue): Promise<string> {
  const clientsColl = collection<Client>(CLIENT_COLLECTION_ID);

  const clientId = await id();

  await set(clientsColl, clientId, {
    id: clientId,
    createdAt: value('serverDate'),
    updatedAt: value('serverDate'),
    registrationToken: null,
    ...clientValue,
  });

  return clientId;
}

export async function updateClient(client: Identity<Client>, clientValue: ClientModificationValue): Promise<void> {
  const clientsColl = collection<Client>(CLIENT_COLLECTION_ID);

  const clientId = getIdFromIdentity(client);

  await update(clientsColl, clientId, {
    updatedAt: value('serverDate'),
    ...clientValue,
  });
}

export async function updateClientRegistrationToken(client: Identity<Client>, registrationToken: string | null): Promise<void> {
  const clientsColl = collection<Client>(CLIENT_COLLECTION_ID);

  const clientId = getIdFromIdentity(client);

  await update(clientsColl, clientId, {
    registrationToken,
  });
}
