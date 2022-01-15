import { startApp } from './core/app';
import appConfig from './core/app/config/appConfig';
import dbSetup from './core/interfaces/db/dbSetup';

const config = appConfig.initConfig();
const dbClient = dbSetup.createDbClient();

startApp({ config, dbClient });
