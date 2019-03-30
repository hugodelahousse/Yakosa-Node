import { getOrCreateConnection } from '@utils/createTypeormConnection';

export let connection;

before(async () => {
  connection = await getOrCreateConnection('test');
});
