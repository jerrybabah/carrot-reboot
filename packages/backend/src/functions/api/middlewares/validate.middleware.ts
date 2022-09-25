import { Next } from 'koa';
import createHttpError from 'http-errors';

import { FirebaseContext } from '../type';
import { SendAuthNumberReqBody, AuthAuthNumberReqBody } from '../dto';

export async function validatePhoneNumberHandler(ctx: FirebaseContext, next: Next): Promise<void> {
  const { phoneNumber } = ctx.req.body as SendAuthNumberReqBody | AuthAuthNumberReqBody;

  if (!/^\d{11}$/g.test(phoneNumber)) {
    throw createHttpError(400, '잘못된 형식의 전화번호입니다.');
  }

  await next();
}

export async function validateAuthNumberHandler(ctx: FirebaseContext, next: Next): Promise<void> {
  const { authNumber } = ctx.req.body as AuthAuthNumberReqBody;

  if (!/^\d{6}$/g.test(authNumber)) {
    throw createHttpError(400, '잘못된 형식의 인증번호입니다.');
  }

  await next();
}

export async function validateTypeHandler(ctx: FirebaseContext, next: Next): Promise<void> {
  const { type } = ctx.req.body as SendAuthNumberReqBody | AuthAuthNumberReqBody;

  if (type !== 'client' && type !== 'worker') {
    throw createHttpError(400, '잘못된 타입입니다.');
  }

  await next();
}
