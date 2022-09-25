import { https } from 'firebase-functions';
import { DefaultState } from 'koa';
import { RouterContext } from 'koa-router';

export type FirebaseCustomContext = {
  req: https.Request;
  query: any;
  request: {
    body?: any;
    files?: any;
  };
};

export type FirebaseContext = RouterContext<DefaultState, FirebaseCustomContext>;

/**
 * <reference>
 * - https://talkjs.com/docs/Reference/Webhooks/#interfaces
 */
export type UserId = string;
export type ConversationId = string;
export type MessageId = string;
export type UnixMilliseconds = number;
export type ByteSize = number;

export type File = {
  url: string;
  size: ByteSize;
};

export type Coordinates = [
  number, // latitude
  number, // longitude
];

export type Message = {
  id: MessageId;
  conversationId: ConversationId;
  type: 'UserMessage' | 'SystemMessage';
  readBy: UserId[];
  senderId: UserId;
  text?: string;
  attachment?: File;
  origin: 'web' | 'rest' | 'email' | 'import';
  location?: Coordinates;
  createdAt: UnixMilliseconds;
};

export type Conversation = {
  id: ConversationId;
  subject?: string;
  topicId?: string;
  photoUrl?: string;
  welcomeMessages?: string[];
  custom?: { [name: string]: string };
  participants: {
    [id: UserId]: { access: 'ReadWrite' | 'Read'; notify: boolean };
  };
  createdAt: UnixMilliseconds;
};

export type User = {
  id: UserId;
  name: string;
  welcomeMessage?: string;
  photoUrl?: string;
  headerPhotoUrl?: string;
  role?: string;
  email?: string[] | null;
  phone?: string[] | null;
  custom?: { [name: string]: string };
  availabilityText?: string;
  locale?: string;
  createdAt: UnixMilliseconds;
};
