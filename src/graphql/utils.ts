import { getRepository, ObjectLiteral, ObjectType } from 'typeorm';
import { SchemaDirectiveVisitor } from 'graphql-tools';
import { createHash } from 'crypto';
import { GraphQLID } from 'graphql';

interface FindListOptions {
  limit?: number;
  offset?: number;
}

export function graphQLFindList<Entity>(
  entityClass: ObjectType<Entity>,
  { limit, offset }: FindListOptions,
  where?: ObjectLiteral,
) {
  let query = getRepository(entityClass).createQueryBuilder().take(limit).skip(offset);
  if (where !== undefined) {
    query = query.where(where);
  }
  return query.getMany();
}
