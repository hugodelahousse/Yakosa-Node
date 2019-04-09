// Load config from `.env` file
require('dotenv').config();

function getEnv(variable: string, defaultValue = <string | undefined> ''): string {
  let value = process.env[variable];
  if (value === undefined) { value = defaultValue; }
  if (value === undefined) {
    throw new Error(`Invalid value for configuration variable: ${variable}`);
  }
  return value;
}

interface Config {
  GOOGLE_CONSUMER_KEY: string;
  GOOGLE_CONSUMER_SECRET: string;
  JWT_SECRET: string;
}

const config: Config = {
  GOOGLE_CONSUMER_KEY: getEnv('GOOGLE_CONSUMER_KEY', 'key'),
  GOOGLE_CONSUMER_SECRET: getEnv('GOOGLE_CONSUMER_SECRET', 'secret'),
  JWT_SECRET: getEnv('JWT_SECRET', 'secret'),
};

export default config;
