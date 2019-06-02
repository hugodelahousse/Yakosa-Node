import {
  getConnectionOptions,
  Connection,
  getConnectionManager,
} from 'typeorm';

export async function getOrCreateConnection(
  name?: string,
): Promise<Connection> {
  const connectionManager = getConnectionManager();
  try {
    return connectionManager.get();
  } catch {
    const connection = connectionManager.create({
      ...(await getConnectionOptions(name)),
      name: 'default',
    });
    return await connection.connect();
  }
}

export default async function createTypeormConnection(): Promise<Connection> {
  if (process.env.NODE_ENV === 'test') {
    return getOrCreateConnection('test');
  }
  return getOrCreateConnection();
}
