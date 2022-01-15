import Koa from 'koa';
import { setupMiddleware } from './app/middleware/setupMiddleware';
import { AppConfig } from './app/config/appConfig';
import { AppDbClient } from './interfaces/db/dbSetup';
import Application from 'koa';
import { AppContext } from './app/context/appContext';

export interface AppParams {
  config: AppConfig;
  dbClient: AppDbClient;
}

export function startApp({ config, dbClient }: AppParams) {
  const { port, host } = config;
  const app = new Koa<Application.DefaultState, AppContext>();

  app.context.dbClient = dbClient;

  setupMiddleware(app);

  const server = app.listen(port, ~~host);

  console.log(`Listening on ${host}:${port}`);

  return {
    server
  };
}
