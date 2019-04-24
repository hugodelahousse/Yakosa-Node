import { getRepository, ObjectLiteral, ObjectType } from 'typeorm';
import { GraphQLScalarType, Kind } from 'graphql';

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

export const dateResolver = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date object',
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return value.toISOString();
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.String) {
        return new Date(ast.value);
      }
      return null;
    },
  }),
};
