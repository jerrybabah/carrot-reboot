export type Portfolio = {
  id: string;

  workerId: string;

  createdAt: Date;

  updatedAt: Date;

  images: string[];

  description: string | null;
};
