const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), 'test.env') });

const { PG_USER, PG_PASSWORD, PG_DATABASE, PG_HOST, PG_PORT } = process.env;

const BASE_PATH = path.join(process.cwd(), 'src', 'core', 'interfaces', 'db');

module.exports = {
  test: {
    client: 'pg',
    connection: {
      host: PG_HOST,
      database: PG_DATABASE,
      port: PG_PORT,
      user: PG_USER,
      password: PG_PASSWORD
    },
    migrations: {
      directory: path.join(BASE_PATH, 'migrations')
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds')
    }
  }
};
