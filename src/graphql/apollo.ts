import { ApolloServer, makeExecutableSchema, gql } from 'apollo-server-express';
import { graphQLFindList } from '@graphql/utils';
import ShoppingList from '@entities/ShoppingList';
import { getRepository } from 'typeorm';
import { User } from '@entities/User';
import { ListProduct } from '@entities/ListProduct';
import { Product } from '@entities/Product';

const typeDefs = gql`
  directive @UUID (
      name: String! = "uid"
      from: [String!]! = ["id"]
  ) on OBJECT
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

      listProduct(id: ID!): ListProduct

      allProducts(offset: Int, limit: Int): [Product!]!
      product(barcode: String!): Product
  }
`;

const resolvers = {
  Query: {
    allUsers: async (parent, args) => await graphQLFindList(User, args),
    user: async (parent, args) => await getRepository(User).findOne(args.id),
    allProducts: async (parent, args) => await graphQLFindList(Product, args),
    product: async (parent, { barcode }) => await getRepository(Product).findOne(barcode),
    listProduct: async (parent, { id }) => await getRepository(ListProduct).findOne(id),
  },
  User: {
    shoppingLists: async ({ id: userId }, args) =>
      graphQLFindList(ShoppingList, args, { userId }),
  },
  ShoppingList: {
    user: async parent => await getRepository(User).findOne(parent.userId),
    products: async (parent) => {
      const products = await getRepository(ListProduct).find({ listId: parent.id });
      return products;
    },
  },
  ListProduct: {
    product: async ({ productBarcode }) =>
      await getRepository(Product).findOne({ barcode: productBarcode }),
    list: async ({ listId }) => await getRepository(ShoppingList).findOne({ id: listId }),
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaDirectives: {},
});

const apollo = new ApolloServer({ schema });

export default apollo;
