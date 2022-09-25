import { Client, Worker, Work, Portfolio, Review, Cursor } from '../model';

export type Pagination<T> = {
  list: T[],
  cursor: Cursor<T, keyof T> | null,
};

export type ClientCreationValue = Pick<Client, 'name' | 'phoneNumber'>;

export type ClientModificationValue = Partial<ClientCreationValue>;

export type WorkerListFilter = {
  field?: string,
  address?: {
    address1: string,
    address2: string,
  },
};

export type WorkerCreationValue = Pick<Worker,
'profileImage' |
'certificateImage' |
'specialties' |
'name' |
'phoneNumber' |
'career' |
'minWage' |
'maxWage' |
'districts' |
'description'>;

export type WorkerModificationValue = Partial<WorkerCreationValue>;

export type WorkListFilter = {
  field?: string,
  address1s?: string[],
  isRecruiting?: boolean,
};

export type WorkCreationValue = Pick<Work,
'field' |
'startDate' |
'endDate' |
'address1' |
'address2' |
'addressDetail' |
'requiredWorkers' |
'title' |
'description' |
'images'>;

export type WorkModificationValue = Partial<WorkCreationValue>;

export type PortfolioCreationValue = Pick<Portfolio,
'images' |
'description'>;

export type PortfolioModificationValue = Partial<PortfolioCreationValue>;

export type ReviewCreationValue = Pick<Review,
'score' |
'description' |
'images'>;

export type ReviewModificationValue = Partial<ReviewCreationValue>;
