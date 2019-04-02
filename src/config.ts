// Load config from `.env` file
require('dotenv').config();

function getEnv(variable: string, defaultValue = undefined): string {
  const value = process.env[variable] || defaultValue;
  if (value === undefined) {
    throw new Error(`Invalid value for configuration variable: ${variable}`);
  }
  return value;
}

interface Config {
  SERVER_URL: string;
  GOOGLE_CONSUMER_KEY: string;
  GOOGLE_CONSUMER_SECRET: string;
}

const config: Config = {
  SERVER_URL: getEnv('SERVER_URL'),
  GOOGLE_CONSUMER_KEY: getEnv('GOOGLE_CONSUMER_KEY'),
  GOOGLE_CONSUMER_SECRET: getEnv('GOOGLE_CONSUMER_SECRET'),
};

export default config;
