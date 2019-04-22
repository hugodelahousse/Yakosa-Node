import { getOrCreateConnection } from '@utils/createTypeormConnection';
import { Connection } from 'typeorm';

export let testConnection : Connection;

before(async () => {
  testConnection = await getOrCreateConnection('test');
});
