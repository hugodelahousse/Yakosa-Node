import { getOrCreateConnection } from '@utils/createTypeormConnection';

export let testConnection;

before(async () => {
  testConnection = await getOrCreateConnection('test');
});
