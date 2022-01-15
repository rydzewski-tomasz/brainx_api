import Router, { Spec } from 'koa-joi-router';
import { healthHandler } from './healthHandler';
import { handlerFactory } from '../../../interfaces/http/handlerFactory';

const router = Router();

router.route(<Spec>{
  handler: handlerFactory(healthHandler),
  method: 'get',
  path: '/health'
});

export default router;
