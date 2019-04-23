import { gql } from 'apollo-server-express';
import { getRepository } from 'typeorm';
import { User } from '@entities/User';
import ShoppingList from '@entities/ShoppingList';
import { graphQLFindList } from '@graphql/utils';

export const typeDefs = gql`
  type User {
      id: Int
      firstName: String!
      lastName: String!
      age: Int
      googleId: String
      shoppingLists: [ShoppingList!]!
  }

  type Query {
      allUsers(offset: Int, limit: Int): [User!]!
      user(id: ID!): User
  }
`;

export const resolvers = {
  Query: {
    allUsers: async (parent, args) => await graphQLFindList(User, args),
    user: async (parent, args) => await getRepository(User).findOne(args.id),
  },
  User: {
    shoppingLists: async ({ id: userId }, args) =>
      graphQLFindList(ShoppingList, args, { userId }),
  },
};
