import * as asyncRedis from 'async-redis';
import config from 'config';

export const redis = asyncRedis.createClient(config.REDIS_URL);

redis.on('error', err => {
  console.log(err);
});
