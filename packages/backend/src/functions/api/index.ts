import Koa from 'koa';
import cors from '@koa/cors';

import { errorHandler } from './middlewares';
import apiRouter from './routes';

const api = new Koa();

api.use(cors());

api.use(errorHandler);
api.use(apiRouter.routes());

const apiHandler = api.callback();

export default apiHandler;
