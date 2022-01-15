const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const {
  PG_USER,
  PG_PASSWORD,
  PG_DATABASE,
  PG_HOST,
  PG_PORT,
} = process.env;

const BASE_PATH = path.join(__dirname, 'src', 'core', 'interfaces', 'db');

module.exports = {
  development: {
    client: 'pg',
    connection: `postgres://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:${PG_PORT}/${PG_DATABASE}`,
    useNullAsDefault: true,
    migrations: {
      directory: path.join(BASE_PATH, 'migrations')
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds')
    },
  },
  production: {
    client: 'pg',
    connection: `postgres://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:${PG_PORT}/${PG_DATABASE}`,
    useNullAsDefault: true,
    migrations: {
      directory: path.join(BASE_PATH, 'migrations')
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds')
    },
  }
};
