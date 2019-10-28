// Load config from `.env` file
require('dotenv').config();

function getEnv(variable: string, defaultValue = undefined): string {
  let value = process.env[variable];
  if (value === undefined) {
    value = defaultValue;
  }
  if (value === undefined) {
    throw new Error(`Invalid value for configuration variable: ${variable}`);
  }
  return value;
}

interface Config {
  GOOGLE_CONSUMER_KEY: string;
  GOOGLE_CONSUMER_SECRET: string;
  REDIS_URL: string;
  JWT_SECRET: string;
  SENTRY_URL: string;
}

const config: Config = {
  GOOGLE_CONSUMER_KEY: getEnv('GOOGLE_CONSUMER_KEY'),
  GOOGLE_CONSUMER_SECRET: getEnv('GOOGLE_CONSUMER_SECRET'),
  JWT_SECRET: getEnv('JWT_SECRET'),
  REDIS_URL: getEnv('REDIS_URL'),
  SENTRY_URL: getEnv('SENTRY_URL'),
};

export default config;
