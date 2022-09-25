import createHttpError from 'http-errors';
import { pushChatNotification } from '../../util';
import { unreadChats } from '../../../firestore';

export async function pushNotiAndSetUnread(recruitId: string, senderRole: string, messageBody?: string): Promise<void> {
  if (senderRole !== 'client' && senderRole !== 'worker') {
    throw createHttpError(400, `알 수 없는 user role: ${senderRole}`);
  }

  const reader = senderRole === 'client' ? 'Worker' : 'Client';

  await Promise.all([
    pushChatNotification(reader, recruitId, messageBody || ''),
    unreadChats(recruitId, reader),
  ]);
}
