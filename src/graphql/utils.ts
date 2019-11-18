import {
  FindManyOptions,
  FindOneOptions,
  getRepository,
  ObjectLiteral,
  ObjectType,
  FindConditions,
  Raw,
  FindOptionsUtils,
} from 'typeorm';
import {
  FieldNode,
  FragmentDefinitionNode,
  GraphQLResolveInfo,
  GraphQLScalarType,
  Kind,
} from 'graphql';
import { Store } from '@entities/Store';
import { isArray } from 'util';
import ShoppingList from '@entities/ShoppingList';
import { createShopingRoute } from '@utils/CreateShoppingRoute';
import { Position } from 'types/PositionType';
import { Vote } from '@entities/Vote';

const MILLISECOND_IN_ONE_DAY = 86400000;

interface FindListOptions {
  limit?: number;
  offset?: number;
}

interface FindStoreOptions {
  distance?: string;
  position?: string;
  limit?: number;
  offset?: number;
}

interface FindRouteOptions {
  shoppingListId: number;
  numMaxOfStore?: number;
  position: string;
  maxDistTravel?: number;
}

function getFieldNode(
  name: String,
  node: FieldNode | FragmentDefinitionNode,
): FieldNode | undefined {
  if (!node.selectionSet) {
    return undefined;
  }

  for (const selection of node.selectionSet.selections) {
    if (selection.kind == 'Field') {
      const relationName = selection.name.value;
      if (relationName == name) {
        return selection;
      }
    }
  }
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
  relationsOverride?: string[],
) {
  const relations = relationsOverride
    ? relationsOverride
    : getQueryRelations(entityClass, info, info.fieldNodes[0]);

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
  relationsOverride?: string[],
) {
  const relations = relationsOverride
    ? relationsOverride
    : getQueryRelations(entityClass, info, info.fieldNodes[0]);

  const options: FindOneOptions<Entity> = { where, relations };

  return getRepository(entityClass).findOne(options);
}

export function graphQlFindNearShopRelatedToPromotion(
  args: FindStoreOptions,
  info: GraphQLResolveInfo,
  id: number,
  relationsOverride?: string[],
) {
  return graphQlFindNearShop(
    args,
    info,
    [
      {
        promotions: [
          {
            id,
          },
        ],
      },
      {
        brand: {
          promotions: [
            {
              id,
            },
          ],
        },
      },
    ],
    relationsOverride,
  );
}

export function graphQlFindNearShopRelatedToShoppingList(
  args: FindStoreOptions,
  info: GraphQLResolveInfo,
  id: number,
  relationsOverride?: string[],
) {
  return graphQlFindNearShop(
    args,
    info,
    [
      {
        promotions: [
          {
            product: {
              listProducts: [
                {
                  list: {
                    id,
                  },
                },
              ],
            },
          },
        ],
      },
      {
        brand: {
          promotions: [
            {
              product: {
                listProducts: [
                  {
                    list: {
                      id,
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ],
    relationsOverride,
  );
}

export function graphQlFindNearShopRelatedToProduct(
  args: FindStoreOptions,
  info: GraphQLResolveInfo,
  barcode: string,
) {
  return graphQlFindNearShop(args, info, [
    {
      promotions: [
        {
          product: {
            listProducts: [
              {
                list: {
                  products: [
                    {
                      productBarcode: barcode,
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
    {
      brand: {
        promotions: [
          {
            product: {
              listProducts: [
                {
                  list: {
                    products: [
                      {
                        productBarcode: barcode,
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ]);
}

export function graphQlFindNearShop(
  { distance, position, limit, offset }: FindStoreOptions,
  info: GraphQLResolveInfo,
  where: FindConditions<Store> | FindConditions<Store>[],
  relationsOverride?: string[],
) {
  const relations = relationsOverride
    ? relationsOverride
    : getQueryRelations(Store, info, info.fieldNodes[0]);
  const CheckDistanceOperator = Raw(
    alias =>
      `ST_Distance(${alias}, ST_GeomFromGeoJSON('${position}'))` +
      `< ${distance || 1000}`,
  );
  if (isArray(where)) {
    where.forEach(element => {
      element.position = CheckDistanceOperator;
    });
  } else {
    where.position = CheckDistanceOperator;
  }

  const options: FindManyOptions<Store> = {
    where,
    relations,
    take: limit,
    skip: offset,
  };

  return (
    FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(
      getRepository(Store).createQueryBuilder(),
      options,
    )
      // .orderBy(`ST_Distance(position, ST_GeomFromGeoJSON('${position}'))`)
      .getMany()
  );
}

/**
 * compute the value of a promotion. Each vote has a value between 30 and 0
 * they lose one point of value each day and become invalid when there value become 0
 * @param votes votes of the promotions
 */
export function graphQlgetPromotionValue(votes: Vote[]): number {
  const now = Date.now();
  return (
    votes
      // we filter the invalid value
      .filter(
        vote => now - vote.created.valueOf() / MILLISECOND_IN_ONE_DAY < 30,
      )
      // then compute the value of each vote
      .map(
        vote =>
          (30 - (now - vote.created.valueOf() / MILLISECOND_IN_ONE_DAY)) *
          (vote.upvote ? 1 : -1),
      )
      // and add all those value
      .reduce((accumulator, currentValue) => accumulator + currentValue)
  );
}

function addInListIfNotPresent(list: String[], value: string | string[]) {
  if (isArray(value)) {
    for (const val of value) {
      addInListIfNotPresent(list, val);
    }
  } else if (list.filter(name => name == value).length == 0) {
    list.push(value);
  }
}

export async function graphQlFindRoute(
  args: FindRouteOptions,
  info: GraphQLResolveInfo,
) {
  const shoppingNode = getFieldNode('shoppingList', info.fieldNodes[0]);
  const shoppingRelation = shoppingNode
    ? getQueryRelations(ShoppingList, info, shoppingNode)
    : ['products', 'products.product'];
  addInListIfNotPresent(shoppingRelation, ['products', 'products.product']);
  const shoppingList = await graphQLFindOne(
    ShoppingList,
    info,
    {
      id: args.shoppingListId,
    },
    shoppingRelation,
  );
  if (!shoppingList) return undefined;

  const storeNode = getFieldNode('stores', info.fieldNodes[0]);
  const storeRelation = storeNode
    ? getQueryRelations(Store, info, storeNode)
    : [
        'promotions',
        'promotions.product',
        'brand',
        'brand.promotions',
        'brand.promotions.product',
      ];
  addInListIfNotPresent(storeRelation, [
    'promotions',
    'promotions.product',
    'brand',
    'brand.promotions',
    'brand.promotions.product',
  ]);
  const shops = await graphQlFindNearShopRelatedToShoppingList(
    {
      distance: args.maxDistTravel ? String(args.maxDistTravel) : '1000',
      position: args.position,
      limit: 100,
    },
    info,
    args.shoppingListId,
    storeRelation,
  );
  const position: Position = JSON.parse(args.position);
  return createShopingRoute(
    shops,
    shoppingList,
    args.numMaxOfStore || 10,
    position,
    args.maxDistTravel || 1000,
  );
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
