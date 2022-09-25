import { WorkSubset } from './work.type';
import { WorkerSubset } from './worker.type';
import { ClientSubset } from './client.type';

export type Recruit = {
  id: string;

  work: WorkSubset & { workStatus: string, isContracted: boolean, contractedAt: Date | null };

  worker: WorkerSubset;

  client: ClientSubset;

  isOffered: boolean;

  createdAt: Date;

  isAccepted: boolean;

  isContracted: boolean;

  contractedAt: Date | null;

  isReviewed: boolean;

  haveUnreadChatsByClient: boolean;

  haveUnreadChatsByWorker: boolean;
};
