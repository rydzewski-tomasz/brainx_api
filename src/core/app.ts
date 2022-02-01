import Koa from 'koa';
import Application from 'koa';
import { setupMiddleware } from './app/middleware/setupMiddleware';
import { AppConfig } from './app/config/appConfig';
import { AppDbClient } from './interfaces/db/dbSetup';
import { AppContext } from './app/context/appContext';
import { Clock } from './utils/clock';

export interface AppParams {
  config: AppConfig;
  dbClient: AppDbClient;
  clock: Clock;
}

export function startApp({ config, dbClient, clock }: AppParams) {
  const { port, host } = config;
  const app = new Koa<Application.DefaultState, AppContext>();

  app.context.dbClient = dbClient;
  app.context.clock = clock;

  setupMiddleware(app);

  const server = app.listen(port, ~~host);

  console.log(`Listening on ${host}:${port}`);

  return {
    server
  };
}
