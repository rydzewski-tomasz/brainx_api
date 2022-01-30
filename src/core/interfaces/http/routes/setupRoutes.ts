import Koa from 'koa';
import healthRouter from '../../../health/interfaces/http/healthRouter';
import Application from 'koa';
import { AppContext } from '../../../app/context/appContext';
import taskRouter from '../../../../task/interfaces/http/taskRouter';

export function setupRoutes(app: Koa<Application.DefaultState, AppContext>) {
  app.use(healthRouter.middleware());
  app.use(taskRouter.middleware());
}
