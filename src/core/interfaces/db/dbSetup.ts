import knex, { Knex } from 'knex';

const config = require('../../../../knexfile');

export interface AppDbClient {
  getDb: () => Knex;
}

function createDbClient(): AppDbClient {
  const db = knex(config.development);
  return { getDb: () => db };
}

export default {
  createDbClient
};
