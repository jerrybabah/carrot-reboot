import { DefaultState } from 'koa';
import Router from 'koa-router';

import { FirebaseCustomContext } from '../type';
import {
  validatePhoneNumberHandler,
  validateAuthNumberHandler,
} from '../middlewares';
import {
  sendAuthNumberCtrl,
  authAuthNumberCtrl,
} from '../controllers/auth.controller';

const authRouter = new Router<DefaultState, FirebaseCustomContext>();

authRouter.post('/sendAuthNumber', validatePhoneNumberHandler, sendAuthNumberCtrl);
authRouter.post('/authAuthNumber', validatePhoneNumberHandler, validateAuthNumberHandler, authAuthNumberCtrl);

export default authRouter;
