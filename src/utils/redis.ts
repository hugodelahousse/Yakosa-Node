import { Tedis } from 'tedis';
import config from 'config';

export const tedis = new Tedis({
  port: config.REDIS_PORT,
  host: config.REDIS_HOST,
});
