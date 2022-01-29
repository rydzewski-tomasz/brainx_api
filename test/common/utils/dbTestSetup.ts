import knex, { Knex } from 'knex';
import randomUtil from './randomUtil';
import { AppDbClient } from '../../../src/core/interfaces/db/dbSetup';

const config = require('../../knexfile.test');

let db: Knex;
let dbName: string;

async function createDb(): Promise<AppDbClient> {
  try {
    dbName = 'brainx_test_db_' + randomUtil.generateRandomString();
    console.log(`Create db: ${dbName} started`);
    db = await createRandomDb(dbName);
    await db.migrate.latest();
    console.log(`Create db: ${dbName} finished`);
    return { getDb: () => db };
  } catch (e) {
    console.error('Test db connection problem! Maybe docker-compose brainx_test_db service not started?');
    console.error(e);
    throw e;
  }
}

async function createRandomDb(dbName: string): Promise<Knex> {
  const initDb = knex(config.test);
  await initDb.raw(`CREATE DATABASE ${dbName}`);
  await initDb.destroy();
  return knex({ ...config.test, connection: { ...config.test.connection, database: dbName } });
}

async function disconnect() {
  await db.destroy();
}

async function dropDb() {
  console.log(`Drop db: ${dbName} started`);
  await db.destroy();
  const initDb = knex(config.test);
  await initDb.raw(`DROP DATABASE ${dbName}`);
  await initDb.destroy();
  console.log(`Drop db: ${dbName} finished`);
}

export default {
  createDb,
  dropDb,
  disconnect
};
