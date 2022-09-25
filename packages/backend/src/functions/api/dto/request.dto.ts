import { UnixMilliseconds, User, Conversation, Message } from '../type';

/**
 * auth
 */
export type SendAuthNumberReqBody = {
  type: string;
  phoneNumber: string;
};

export type AuthAuthNumberReqBody = {
  type: string;
  phoneNumber: string;
  authNumber: string;
};

/**
 * webhook
 * <reference>
 * - https://talkjs.com/docs/Reference/Webhooks/#event-structure
 */
export type TalkjsReqBody = {
  id: string;
  createdAt: UnixMilliseconds;
  data: {
    [name: string]: any;
  };
  type: string;
};

export type MessageSentEventData = {
  sender: User;
  conversation: Conversation;
  message: Message;
};
