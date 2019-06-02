import {
  FindManyOptions,
  FindOneOptions,
  getRepository,
  ObjectLiteral,
  ObjectType,
} from 'typeorm';
import {
  FieldNode,
  FragmentDefinitionNode,
  GraphQLResolveInfo,
  GraphQLScalarType,
  Kind,
} from 'graphql';

interface FindListOptions {
  limit?: number;
  offset?: number;
}

function getQueryFields<Entity>(
  entityClass: ObjectType<Entity>,
  node: FieldNode,
) {
  const metadata = getRepository(entityClass).metadata;
  const columns = metadata.columns.map(f => f.propertyName);

  const queryFields = metadata.primaryColumns.map(c => c.propertyName);

  if (!node.selectionSet) {
    return queryFields;
  }

  return queryFields.push(
    ...node.selectionSet.selections
      .map(<FieldNode>({ name: { value } }) => value)
      .filter(field => columns.includes(field)),
  );
}

function getQueryRelations<Entity>(
  entityClass: ObjectType<Entity>,
  info: GraphQLResolveInfo,
  node: FieldNode | FragmentDefinitionNode,
) {
  if (!node.selectionSet) {
    return [];
  }

  const relationMap: Map<string, any> = new Map<string, any>();
  getRepository(entityClass).metadata.relations.forEach(r => {
    relationMap[r.propertyPath] = r.type;
  });

  const relations: string[] = [];

  for (const selection of node.selectionSet.selections) {
    if (selection.kind === 'FragmentSpread') {
      relations.push(
        ...getQueryRelations(
          entityClass,
          info,
          info.fragments[selection.name.value],
        ),
      );
      continue;
    }

    if (selection.kind !== 'Field' || !selection.selectionSet) {
      continue;
    }

    const relationName = selection.name.value;

    if (!relationMap.hasOwnProperty(relationName)) {
      continue;
    }
    relations.push(relationName);

    for (const subRelation of getQueryRelations(
      relationMap[relationName],
      info,
      selection,
    )) {
      relations.push(`${relationName}.${subRelation}`);
    }
  }
  return relations;
}

export function graphQLFindList<Entity>(
  entityClass: ObjectType<Entity>,
  { limit, offset }: FindListOptions,
  info: GraphQLResolveInfo,
  where?: ObjectLiteral,
) {
  const relations = getQueryRelations(entityClass, info, info.fieldNodes[0]);

  const options: FindManyOptions<Entity> = {
    where,
    relations,
    take: limit,
    skip: offset,
  };

  return getRepository(entityClass).find(options);
}

export function graphQLFindOne<Entity>(
  entityClass: ObjectType<Entity>,
  info: GraphQLResolveInfo,
  where?: ObjectLiteral,
) {
  const relations = getQueryRelations(entityClass, info, info.fieldNodes[0]);

  const options: FindOneOptions<Entity> = { where, relations };

  return getRepository(entityClass).findOne(options);
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
      if (ast.kind === Kind.STRING) {
        return new Date(ast.value);
      }
      return null;
    },
  }),
};
