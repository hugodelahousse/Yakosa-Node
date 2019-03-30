import { getConnectionManager, getConnectionOptions } from 'typeorm';

export let connection;

const manager = getConnectionManager();

before(async () => {
  if (manager.has('test')) {
    connection = manager.get('test');
  }
  connection = manager.create(await getConnectionOptions('test'));
  await connection.connect();
});
