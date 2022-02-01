import { Context } from 'koa';
import { AppDbClient } from '../../interfaces/db/dbSetup';
import { Clock } from '../../utils/clock';

export type AppContext = Context & {
  dbClient: AppDbClient;
  clock: Clock;
};

export type DbContext = AppDbClient;
