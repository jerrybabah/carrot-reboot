import { FirebaseContext } from '../type';
import {
  SendAuthNumberReqBody,
  AuthAuthNumberReqBody,
} from '../dto';
import {
  sendAuthNumber,
  authAuthNumber,
} from '../services/auth.service';

export async function sendAuthNumberCtrl(ctx: FirebaseContext): Promise<void> {
  const { type, phoneNumber } = ctx.req.body as SendAuthNumberReqBody;

  await sendAuthNumber(phoneNumber, type);

  ctx.body = {
    status: 200,
    name: 'OK',
    msg: '인증번호 전송 완료',
  };
}

export async function authAuthNumberCtrl(ctx: FirebaseContext): Promise<void> {
  const { type, phoneNumber, authNumber } = ctx.req.body as AuthAuthNumberReqBody;

  const token = await authAuthNumber(phoneNumber, authNumber, type);

  ctx.body = {
    status: 200,
    name: 'OK',
    msg: '인증 완료',
    token,
  };
}
