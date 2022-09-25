import { Districts } from './common.type';

export type Worker = {
  id: string;

  createdAt: Date;

  updatedAt: Date;

  profileImage: string | null;

  certificateImage: string;

  specialties: string[];

  name: string;

  phoneNumber: string;

  totalScore: number;

  averageScore: number;

  reviewCount: number;

  contractCount: number;

  portfolioCount: number;

  favoriterCount: number;

  career: number;

  minWage: number;

  maxWage: number;

  hugeDistricts: string[];

  districts: Districts;

  description: string;

  expirationDate: Date | null;

  isActive: boolean;

  haveUncheckedOffers: boolean;

  haveUncheckedContracts: boolean;

  registrationToken: string | null;
};

export type WorkerSubset = Pick<Worker,
'id' |
'profileImage' |
'specialties' |
'name' |
'phoneNumber' |
'averageScore' |
'reviewCount' |
'contractCount' |
'minWage' |
'maxWage' |
'hugeDistricts' |
'districts'>;

export type FavoriteWorker = WorkerSubset & {
  clientId: string;

  workerId: string;

  createdAt: Date; // INFO: 즐겨찾기한 시간. worker.createdAt과 다름

  expirationDate: Date | null;

  isActive: boolean;
};

export type SpecialtyWorker = WorkerSubset & {
  workerId: string;

  createdAt: Date; // INFO: worker.createdAt과 같음

  updatedAt: Date; // INFO: worker.updatedAt과 같음

  expirationDate: Date | null;

  isActive: boolean;
};
