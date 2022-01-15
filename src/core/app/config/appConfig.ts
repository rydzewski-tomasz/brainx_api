import dotenv from 'dotenv';

enum Env {
  local = 'local',
  test = 'test'
}

export interface AppConfig {
  env: Env;
  host: string;
  port: number;
}

let config: AppConfig;

function getConfig(): AppConfig {
  return config;
}

function initConfig(pathToEnvFile?: string): AppConfig {
  dotenv.config({ path: pathToEnvFile });

  config = {
    env: getEnv(),
    host: getHost(),
    port: getPort()
  };

  return config;
}

function getEnv(): Env {
  const { ENV } = process.env;

  switch ((ENV || '').toLowerCase()) {
    case 'local':
      return Env.local;
    case 'test':
      return Env.test;
    default:
      throw new Error('ENV variable not set!');
  }
}

function getHost(): string {
  const { HOST } = process.env;
  return HOST || throwError('HOST variable not set!');
}

function getPort(): number {
  const { PORT } = process.env;
  return +(PORT || throwError('PORT variable not set!'));
}

function throwError(errorMessage: string): never {
  throw new Error(errorMessage);
}

export default {
  getConfig,
  initConfig
};
