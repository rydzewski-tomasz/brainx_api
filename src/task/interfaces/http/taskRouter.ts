import Router, { Joi, Spec } from 'koa-joi-router';
import { addTaskHandler, getTaskHandler, updateTaskHandler } from './taskHandler';
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

router.route(<Spec>{
  handler: handlerFactory(getTaskHandler),
  method: 'get',
  path: '/task/:taskId'
});

router.route(<Spec>{
  handler: handlerFactory(updateTaskHandler),
  method: 'put',
  path: '/task/:taskId',
  validate: {
    body: {
      name: Joi.string(),
      description: Joi.string(),
      color: Joi.string()
    },
    type: 'json'
  }
});

export default router;
