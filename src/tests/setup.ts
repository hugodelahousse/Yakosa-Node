import createTypeormConnection from '../utils/createTypeormConnection';

export let connection;

before(async () => {
  connection = await createTypeormConnection();
});

after(async () => {
  connection = await connection.close();
});
