import {
  ApolloServer,
  AuthenticationError,
  makeExecutableSchema,
  gql,
} from 'apollo-server-express';
import {
  graphQLFindList,
  graphQLFindOne,
  graphQlFindNearShop,
  graphQlFindNearShopRelatedToPromotion,
  graphQlFindNearShopRelatedToShoppingList,
  graphQlFindNearShopRelatedToProduct,
  graphQlFindRoute,
  graphQlgetPromotionValue,
} from '@graphql/utils';
import { User } from '@entities/User';
import { ListProduct } from '@entities/ListProduct';
import { Product } from '@entities/Product';
import { Store } from '@entities/Store';
import * as jwt from 'jsonwebtoken';
import { JWT } from '../middlewares/checkJwt';
import config from 'config';
import { getRepository, DeepPartial } from 'typeorm';
import ShoppingList from '@entities/ShoppingList';
import { getProductFromBarcode } from '@utils/OpendFoodFactAPI';
import { Vote } from '@entities/Vote';
import { Promotion } from '@entities/Promotion';

const typeDefs = gql`
  enum MeasuringUnits {
    UNIT
    GRAMME
    KILOGRAM
    LITRE
    CENTILITRE
  }

  directive @UUID(name: String! = "uid", from: [String!]! = ["id"]) on OBJECT
  scalar Date

  input PositionInput {
    type: String!
    coordinates: [Float!]!
  }

  type Position {
    type: String!
    coordinates: [Float!]!
  }

  type ProductInfo {
    image_url: String
    brands: String
    product_name_fr: String
    generic_name_fr: String
  }

  type User {
    id: Int
    firstName: String!
    lastName: String!
    age: Int
    googleId: String
    shoppingLists: [ShoppingList!]!
  }

  type ShoppingList {
    id: ID!
    user: User!
    name: String!
    creationDate: Date!
    lastUsed: Date
    products: [ListProduct!]!

    nearbyStore(
      distance: String
      position: PositionInput!
      offset: Int
      limit: Int
    ): [Store!]!
  }

  type ListProduct {
    id: ID!
    quantity: Int!
    unit: MeasuringUnits!
    list: ShoppingList!
    product: Product!
  }

  type Product {
    barcode: String!

    nearbyStore(
      distance: String
      position: String!
      offset: Int
      limit: Int
    ): [Store!]!

    info: ProductInfo
  }

  type Store {
    id: ID!
    position: Position!
    brand: Brand
    promotions: [Promotion!]!
    name: String!
    address: String!
  }

  type Brand {
    id: ID!
    name: String!
    promotions: [Promotion!]!
  }

  type Promotion {
    id: ID!
    product: Product!
    brand: Brand
    store: Store
    promotion: Float
    price: Float
    type: Int

    units: MeasuringUnits
    quantity: Int

    votes: [Vote!]!

    nearbyStore(
      distance: String
      position: String!
      offset: Int
      limit: Int
    ): [Store!]!

    promotionValue: Int
  }

  type Vote {
    id: ID!
    upvote: Boolean
    user: User
    promotion: Promotion
    created: Date
  }

  type ShoppingRoute {
    shoppingList: ShoppingList!
    stores: [Store!]!
    promotions: [Promotion!]!
    economie: Float!
  }

  type Query {
    allUsers(offset: Int, limit: Int): [User!]!
    user(id: ID!): User

    shoppingList(id: ID!): ShoppingList
    listProduct(id: ID!): ListProduct

    allProducts(offset: Int, limit: Int): [Product!]!
    product(barcode: String!): Product

    allStore(offset: Int, limit: Int): [Store!]!
    store(id: ID!): Store

    vote(userId: ID!, promotionId: ID!): Vote

    nearbyStore(
      distance: String
      position: String!
      offset: Int
      limit: Int
    ): [Store!]!
    currentUser: User

    shoppingRoute(
      shoppingListId: ID!
      numMaxOfStore: Int
      position: String!
      maxDistTravel: Float
    ): ShoppingRoute!
  }

  type Mutation {
    createList(name: String): ShoppingList
    updateList(id: ID!, name: String): ShoppingList
    deleteList(id: ID!): Boolean!

    addListProductWithbarcode(
      list: ID!
      barcode: String
      quantity: Int
      unit: MeasuringUnits!
    ): ListProduct

    addListProduct(
      list: ID!
      product: ID!
      quantity: Int
      unit: MeasuringUnits!
    ): ListProduct
    updateListProduct(
      id: ID!
      quantity: Int!
      unit: MeasuringUnits!
    ): ListProduct
    removeListProduct(id: ID!): Boolean!

    addOrUpdateVote(userId: ID!, promotionId: ID!, upvote: Boolean!): Vote

    removeVote(id: ID!): Boolean!

    addPromotion(
      barcode: String!
      price: Float!
      promotion: Float!
      beginDate: Date
      endDate: Date
      brandId: ID
      storeId: ID
      description: String
      quantity: Int
      unit: MeasuringUnits
    ): Promotion

    updatePromotion(
      id: ID!
      price: Float!
      promotion: Float!
      beginDate: Date
      endDate: Date
      description: String
      quantity: Int
      unit: MeasuringUnits
    ): Promotion

    removePromotion(id: ID!): Boolean!
  }
`;

const resolvers = {
  MeasuringUnits: {
    UNIT: 0,
    GRAMME: 1,
    KILOGRAM: 2,
    LITRE: 3,
    CENTILITRE: 4,
  },
  Query: {
    allUsers: async (parent, args, _, info) =>
      await graphQLFindList(User, args, info),
    user: async (parent, args, _, info) =>
      await graphQLFindOne(User, info, { id: args.id }),

    currentUser: async (parent, args, context, info) => {
      if (!context.user) {
        return null;
      }
      return await graphQLFindOne(User, info, { id: context.user });
    },

    allProducts: async (parent, args, _, info) =>
      await graphQLFindList(Product, args, info),
    product: async (parent, args, _, info) =>
      await graphQLFindOne(ListProduct, info, { barcode: args.barcode }),
    listProduct: async (parent, args, _, info) =>
      await graphQLFindOne(ListProduct, info, { id: args.id }),
    allStore: async (parent, args, _, info) =>
      await graphQLFindList(Store, args, info),
    store: async (parent, args, _, info) =>
      await graphQLFindOne(Store, info, { id: args.id }),
    vote: async (parent, args, _, info) =>
      await graphQLFindOne(Vote, info, {
        userId: args.userId,
        promotionId: args.promotionId,
      }),
    nearbyStore: async (parent, args, _, info) =>
      await graphQlFindNearShop(args, info, {}),
    shoppingList: async (parent, args, _, info) =>
      await graphQLFindOne(ShoppingList, info, { id: args.id }),
    shoppingRoute: async (parent, args, _, info) =>
      await graphQlFindRoute(args, info),
  },
  User: {
    shoppingLists: async parent => parent.shoppingLists,
  },
  ShoppingList: {
    user: async parent => parent.user,
    products: async parent => parent.products,

    nearbyStore: async (parent, args, _, info) =>
      await graphQlFindNearShopRelatedToShoppingList(args, info, parent.id),
  },
  ListProduct: {
    product: async parent => parent.product,
    list: async parent => parent.list,
  },
  Promotion: {
    promotionValue: async (parent, args, _, info) =>
      await graphQlgetPromotionValue(parent.votes),
    nearbyStore: async (parent, args, _, info) =>
      await graphQlFindNearShopRelatedToPromotion(args, info, parent.id),
  },
  Product: {
    info: async (parent, args, _, info) =>
      await getProductFromBarcode(parent.barcode),
    nearbyStore: async (parent, args, _, info) =>
      await graphQlFindNearShopRelatedToProduct(args, info, parent.barcode),
  },

  Mutation: {
    createList: async (parent, { name }, { user }, info) => {
      if (user === null) {
        return null;
      }
      const newList = await getRepository(ShoppingList).save({
        name,
        creationDate: new Date(),
        user: {
          id: user,
        },
      });

      return await graphQLFindOne(ShoppingList, info, { id: newList.id });
    },

    updateList: async (parent, { id, name }, { user }, info) => {
      if (user === null) {
        return null;
      }
      await getRepository(ShoppingList).update(id, { name });

      return await graphQLFindOne(ShoppingList, info, { id });
    },

    deleteList: async (parent, { id }, { user }) => {
      if (user === null) {
        return null;
      }
      const result = await getRepository(ShoppingList).delete({
        id,
        user: { id: user },
      });
      return !!result.raw[1];
    },

    addListProductWithbarcode: async (
      parent,
      { list, barcode, quantity, unit },
      { user },
      info,
    ) => {
      if (user === null) {
        return null;
      }

      let product = await getRepository(Product).findOne(barcode);
      if (!product) {
        product = await getRepository(Product).save({ barcode });
      }
      const result = await getRepository(ListProduct).save({
        unit,
        list: { id: list },
        product: { barcode },
        quantity: quantity || 1,
      });

      return await graphQLFindOne(ListProduct, info, { id: result.id });
    },

    addListProduct: async (
      parent,
      { list, product, quantity, unit },
      { user },
      info,
    ) => {
      if (user === null) {
        return null;
      }

      const result = await getRepository(ListProduct).save({
        unit,
        list: { id: list },
        product: { barcode: product },
        quantity: quantity || 1,
      });

      return await graphQLFindOne(ListProduct, info, { id: result.id });
    },

    updateListProduct: async (
      parent,
      { id, quantity, unit },
      { user },
      info,
    ) => {
      if (user === null) {
        return null;
      }
      if (quantity <= 0) {
        await getRepository(ListProduct).delete(id);
        return null;
      }
      await getRepository(ListProduct).update(id, { quantity, unit });

      return await graphQLFindOne(ListProduct, info, { id });
    },

    removeListProduct: async (parent, { id }, { user }, info) => {
      if (user === null) {
        return null;
      }
      const result = await getRepository(ListProduct).delete(id);
      return !!result.raw[1];
    },

    addOrUpdateVote: async (
      parent,
      { userId, promotionId, upvote },
      { user },
      info,
    ) => {
      if (user === null || user.id !== userId) {
        return null;
      }
      const voteRepository = getRepository(Vote);
      const partialVote: DeepPartial<Vote> = {
        userId,
        promotionId,
        upvote,
        created: new Date(),
      };
      const vote = await voteRepository.findOne({ promotionId, userId });
      if (vote !== null && vote !== undefined) {
        if (vote.userId !== user.id) {
          throw new AuthenticationError('Unauthorized');
        }

        partialVote.id = vote.id;
      }
      const result = await voteRepository.save(partialVote);

      return await graphQLFindOne(Vote, info, { id: result.id });
    },

    removeVote: async (parent, { id }, { user }, info) => {
      if (user === null) {
        return null;
      }
      const vote = await getRepository(Vote).findOne({ id });
      if (vote && vote.userId !== user.id) {
        throw new AuthenticationError('Unauthorized');
      }

      const result = await getRepository(Vote).delete(id);
      return !!result.raw[1];
    },
    addPromotion: async (
      parent,
      {
        barcode,
        price,
        promotion,
        beginDate,
        endDate,
        brandId,
        storeId,
        description,
        quantity,
        unit,
      },
      { user },
      info,
    ) => {
      if (user === null) {
        return null;
      }
      if (!storeId && !brandId) {
        return null;
      }
      if (!beginDate) {
        beginDate = new Date();
      }
      if (!quantity || !unit) {
        quantity = 1;
        unit = 0;
      }
      let product = await getRepository(Product).findOne(barcode);
      if (!product) {
        product = await getRepository(Product).save({ barcode });
      }

      const promo: DeepPartial<Promotion> = {
        brandId,
        beginDate,
        product,
        price,
        promotion,
        endDate,
        storeId,
        description,
        quantity,
        unit,
      };

      const result = await getRepository(Promotion).save(promo);

      return await graphQLFindOne(Promotion, info, { id: result.id });
    },

    updatePromotion: async (
      parent,
      { id, price, promotion, beginDate, endDate, description, quantity, unit },
      { user },
      info,
    ) => {
      if (user === null) {
        return null;
      }
      if (!beginDate) {
        beginDate = new Date();
      }
      if (!quantity || !unit) {
        quantity = 1;
        unit = 0;
      }

      const promo: DeepPartial<Promotion> = {
        id,
        beginDate,
        price,
        promotion,
        endDate,
        description,
        quantity,
        unit,
      };

      const result = await getRepository(Promotion).save(promo);

      return await graphQLFindOne(Promotion, info, { id: result.id });
    },

    removePromotion: async (parent, { id }, { user }, info) => {
      if (user === null) {
        return null;
      }
      const result = await getRepository(Promotion).delete(id);
      return !!result.raw[1];
    },
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaDirectives: {},
});

const apollo = new ApolloServer({
  schema,
  context: ({ req }) => {
    const token = req.headers.authorization;
    if (!token) {
      return { user: null };
    }

    // The token is passed as a header in the form JWT <TOKEN> or Bearer <TOKEN>
    const jwtDecoded = jwt.verify(
      token.split(' ')[1],
      config.JWT_SECRET,
    ) as JWT;

    if (!jwtDecoded) {
      return { user: null };
    }

    return {
      user: jwtDecoded.userId,
    };
  },
});

export default apollo;
