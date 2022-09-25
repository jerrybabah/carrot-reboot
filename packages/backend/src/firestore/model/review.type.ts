import { ClientSubset } from './client.type';
import { WorkSubset } from './work.type';
import { WorkerSubset } from './worker.type';

export type Review = {
  id: string;

  createdAt: Date;

  updatedAt: Date;

  score: number;

  description: string;

  images: string[];

  worker: WorkerSubset;

  client: ClientSubset;

  work: WorkSubset;
};
