import { ApolloServer, makeExecutableSchema, gql } from 'apollo-server-express';
import { graphQLFindList, graphQLFindOne } from '@graphql/utils';
import { User } from '@entities/User';
import { ListProduct } from '@entities/ListProduct';
import { Product } from '@entities/Product';
import * as jwt from 'jsonwebtoken';
import { JWT } from '../middlewares/checkJwt';
import config from 'config';

const typeDefs = gql`
  directive @UUID(name: String! = "uid", from: [String!]! = ["id"]) on OBJECT
  scalar Date

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
    creationDate: Date!
    lastUsed: Date
    products: [ListProduct!]!
  }

  type ListProduct {
    id: ID!
    quantity: Int!
    list: ShoppingList!
    product: Product!
  }

  type Product {
    barcode: String!
  }

  type Query {
    allUsers(offset: Int, limit: Int): [User!]!
    user(id: ID!): User
    currentUser: User

    listProduct(id: ID!): ListProduct

    allProducts(offset: Int, limit: Int): [Product!]!
    product(barcode: String!): Product
  }
`;

const resolvers = {
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
  },
  User: {
    shoppingLists: async parent => parent.shoppingLists,
  },
  ShoppingList: {
    user: async parent => parent.user,
    products: async parent => parent.products,
  },
  ListProduct: {
    product: async parent => parent.product,
    list: async parent => parent.list,
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
