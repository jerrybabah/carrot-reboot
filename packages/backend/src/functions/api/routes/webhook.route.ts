import { DefaultState } from 'koa';
import Router from 'koa-router';

import { FirebaseCustomContext } from '../type';
import { talkjsCtrl } from '../controllers/webhook.controller';

const webhookRouter = new Router<DefaultState, FirebaseCustomContext>();

webhookRouter.post('/talkjs', talkjsCtrl);

export default webhookRouter;
