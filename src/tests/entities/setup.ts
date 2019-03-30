import createTypeormConnection from '../../utils/createTypeormConnection';

export let connection;

before(async () => {
  if (connection !== null) { return; }
  connection = await createTypeormConnection();
});

after(async () => {
  connection = await connection.close();
});
