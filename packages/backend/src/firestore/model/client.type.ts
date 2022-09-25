export type Client = {
  id: string;

  createdAt: Date;

  updatedAt: Date;

  name: string;

  phoneNumber: string;

  registrationToken: string | null;
};

export type ClientSubset = Pick<Client,
'id' |
'name' |
'phoneNumber'>;
