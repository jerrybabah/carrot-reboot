export type PhoneNumberAuth = {
  id: string;

  type: string;

  phoneNumber: string;

  authNumber: string;

  expirationTime: Date;
};
