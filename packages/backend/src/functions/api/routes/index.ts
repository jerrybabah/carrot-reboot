import { DefaultState } from 'koa';
import Router from 'koa-router';

import { FirebaseCustomContext } from '../type';
import authRouter from './auth.route';
import webhookRouter from './webhook.route';

const apiRouter = new Router<DefaultState, FirebaseCustomContext>();

apiRouter.use('/auth', authRouter.routes());
apiRouter.use('/webhook', webhookRouter.routes());

export default apiRouter;
