import Koa from 'koa';
import { setupRoutes } from '../../interfaces/http/routes/setupRoutes';
import Application from 'koa';
import { AppContext } from '../context/appContext';
import { errorMiddleware } from './errorMiddleware';

export function setupMiddleware(app: Koa<Application.DefaultState, AppContext>) {
  app.use(errorMiddleware);
  setupRoutes(app);
}
