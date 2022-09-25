import { ClientSubset } from './client.type';

export type RequiredWorkerInfo = {
  type: string;
  wage: number;
};

export type Work = {
  id: string;

  createdAt: Date;

  updatedAt: Date;

  client: ClientSubset & { id: string };

  field: string;

  startDate: Date;

  endDate: Date;

  address1: string;

  address2: string;

  addressDetail: string | null;

  requiredWorkers: RequiredWorkerInfo[];

  totalCost: number;

  title: string;

  description: string;

  images: string[];

  isContracted: boolean;

  contractedAt: Date | null;

  workStatus: string;

  contractCount: number;

  haveUncheckedApplicants: boolean;
};

export type WorkSubset = Pick<Work,
'id' |
'field' |
'startDate' |
'endDate' |
'address1' |
'address2' |
'addressDetail' |
'requiredWorkers' |
'totalCost' |
'title'>;
