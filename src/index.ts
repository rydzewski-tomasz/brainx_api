import { startApp } from './core/app';
import appConfig from './core/app/config/appConfig';
import dbSetup from './core/interfaces/db/dbSetup';
import { clockFactory } from './core/utils/clock';

const config = appConfig.initConfig();
const dbClient = dbSetup.createDbClient();
const clock = clockFactory();

startApp({ config, dbClient, clock });
