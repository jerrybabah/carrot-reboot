import { Next } from 'koa';
import { HttpError } from 'http-errors';

import { FirebaseContext } from '../type';

export async function errorHandler(ctx: FirebaseContext, next: Next): Promise<void> {
  try {
    await next();
  } catch (e: any) {
    if (e instanceof HttpError) {
      ctx.status = e.status;
      ctx.body = {
        status: e.status,
        name: e.name,
        msg: e.message,
      };
    } else {
      ctx.status = 500;
      ctx.body = {
        status: ctx.status,
        name: 'InternalServerError',
        msg: e.message || 'internal server error',
      };
    }
  }
}
