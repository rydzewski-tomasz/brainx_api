import { AppParams, startApp } from '../../../src/core/app';
import appConfig, { AppConfig } from '../../../src/core/app/config/appConfig';
import { AppDbClient } from '../../../src/core/interfaces/db/dbSetup';
import { Server } from 'http';
import supertest, { SuperTest } from 'supertest';
import { promisify } from 'util';
import path from 'path';
import dbTestSetup from '../utils/dbTestSetup';
import { AddressInfo } from 'net';
import { currentDate } from '../mock/clock.mock';

let appServer: Server;
export let requestUtil: SuperTest<any>;
const config = createConfig();
export let dbClient: AppDbClient;
const clock = { now: () => currentDate };

export function initFullEnv() {
  return {
    beforeAll: beforeAll(async () => {
      dbClient = await createDbClient();
      startTestApp({ config, dbClient, clock });
    }),
    afterAll: afterAll(async () => {
      await stopTestApp();
      await closeDb();
    })
  };
}

export function initHttpEnv() {
  return {
    beforeAll: beforeAll(async () => {
      dbClient = { getDb: jest.fn() };
      startTestApp({ config, dbClient, clock });
    }),
    afterAll: afterAll(async () => {
      await stopTestApp();
    })
  };
}

function createConfig(): AppConfig {
  const pathToTestEnvFile = path.resolve(process.cwd(), 'test.env');
  return appConfig.initConfig(pathToTestEnvFile);
}

export async function createDbClient(): Promise<AppDbClient> {
  return dbTestSetup.createDb();
}

function startTestApp(params: AppParams) {
  const { server } = startApp(params);
  appServer = server;
  const serverUrl = `http://${config.host}:${getServerPort(appServer)}`;
  requestUtil = supertest(serverUrl);
}

function getServerPort(appServer: Server) {
  const address = appServer.address() as AddressInfo;
  return address.port;
}

async function stopTestApp() {
  await promisify(appServer.close).bind(appServer)();
}

async function closeDb() {
  await dbTestSetup.dropDb();
}
