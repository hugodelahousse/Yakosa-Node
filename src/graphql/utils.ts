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

export class UUIDDirective extends SchemaDirectiveVisitor {
  visitObject(type) {
    const { name, from } = this.args;
    const fields = type.getFields();
    if (name in fields) {
      throw new Error(`Conflicting field name ${name}`);
    }
    fields[name] = {
      name,
      type: GraphQLID,
      description: 'Unique ID',
      args: [],
      resolve(object) {
        const hash = createHash('sha1');
        hash.update(type.name);
        from.forEach(fieldName => hash.update(String(object[fieldName])));
        return hash.digest('hex');
      },
    };
  }
}
