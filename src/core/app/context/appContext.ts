import { Context } from 'koa';
import { AppDbClient } from '../../interfaces/db/dbSetup';

export type AppContext = Context & {
  dbClient: AppDbClient;
};

export type DbContext = AppDbClient;
