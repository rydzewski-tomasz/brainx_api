import Router, { Spec, Joi } from 'koa-joi-router';
import { addTaskHandler } from './taskHandler';
import { handlerFactory } from '../../../core/interfaces/http/handlerFactory';

const router = Router();

router.route(<Spec>{
  handler: handlerFactory(addTaskHandler),
  method: 'post',
  path: '/task',
  validate: {
    body: {
      name: Joi.string().required(),
      description: Joi.string().required(),
      color: Joi.string().required()
    },
    type: 'json'
  }
});

export default router;
