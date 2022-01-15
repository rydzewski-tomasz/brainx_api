import knex, { Knex } from 'knex';
import randomUtil from './randomUtil';
import { AppDbClient } from '../../../src/core/interfaces/db/dbSetup';

const config = require('../../knexfile.test');

let db: Knex;
let dbName: string;

async function createDb(): Promise<AppDbClient> {
  try {
    db = knex(config.test);
    dbName = 'brainx_test_db_' + randomUtil.generateRandomString();
    console.log(`Start db: ${dbName}`);
    await db.raw(`CREATE DATABASE ${dbName}`);
    await db.migrate.latest();
    return { getDb: () => db };
  } catch (e) {
    console.error('Test db connection problem! Maybe docker-compose brainx_test_db service not started?');
    console.error(e);
    throw e;
  }
}

async function dropDb() {
  console.log(`Stop db: ${dbName}`);
  await db.raw(`DROP DATABASE ${dbName}`);
  await db.destroy();
}

export default {
  createDb,
  dropDb
};
