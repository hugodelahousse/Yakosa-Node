import { getConnectionOptions, createConnection, Connection } from 'typeorm';

export default async function createTypeormConnection(): Promise<Connection> {
  if (process.env.NODE_ENV === 'test') {
    return createConnection(await getConnectionOptions('test'));
  }
  return createConnection();
}
