import { Builder, Loader, Parser, Resolver } from 'typeorm-fixtures-cli/dist';
import { getOrCreateConnection } from '@utils/createTypeormConnection';
import { getRepository } from 'typeorm';

const loader = new Loader();
const resolver = new Resolver();
const fixturesDir = `${__dirname}/../../../fixtures`;
export default async function loadFixtures(...paths: string[]) {
  paths.forEach(path => loader.load(`${fixturesDir}/${path}`));
  const fixtures = resolver.resolve(loader.fixtureConfigs);
  const builder = new Builder(await getOrCreateConnection(), new Parser());
  const entities = await Promise.all(fixtures.map(fixture => builder.build(fixture)));
  await Promise.all(entities.map(entity => getRepository(entity.constructor.name).save(entity)));
}
