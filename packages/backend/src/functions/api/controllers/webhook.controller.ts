import createHttpError from 'http-errors';

import { FirebaseContext } from '../type';
import { TalkjsReqBody, MessageSentEventData } from '../dto';
import { pushNotiAndSetUnread } from '../services/webhook.service';

export async function talkjsCtrl(ctx: FirebaseContext): Promise<void> {
  const { data, type } = ctx.req.body as TalkjsReqBody;

  /**
   * INFO
   * 지원하는 webhook type
   * - message.sent
   */
  switch (type) {
    case 'message.sent': {
      const { sender, conversation, message } = data as MessageSentEventData;

      if (!conversation.custom?.recruitId) {
        throw createHttpError(400, `conversation recruitId 설정되지 않음: ${conversation.custom?.recruitId}`);
      }

      if (!sender.role) {
        throw createHttpError(400, `sender role 설정되지 않음: ${sender.role}`);
      }

      await pushNotiAndSetUnread(conversation.custom.recruitId, sender.role, message.text);

      break;
    }

    default: {
      throw createHttpError(400, `unsupported talkjs webhook type: ${type}`);
    }
  }

  ctx.body = {
    status: 200,
    name: 'OK',
    msg: '',
  };
}
