import { Context } from 'koa';
import { AppDbClient } from '../../interfaces/db/dbSetup';

export type AppContext = Context & { dbContext: DbContext } & {
  dbClient: AppDbClient;
};

export type DbContext = { dbClient: AppDbClient };
