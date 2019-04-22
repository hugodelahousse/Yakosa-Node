import { gql } from 'apollo-server-express';
import { FindManyOptions, getRepository } from 'typeorm';
import { User } from '@entities/User';
import ShoppingList from '@entities/ShoppingList';

export const typeDefs = gql`
  type User {
      id: ID!
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
    allUsers: async (parent, args, context, info) => {
      console.log(parent, args, context, info);
      const options: FindManyOptions = {};
      if (args.offset !== undefined) { options.skip = args.offset; }
      if (args.limit !== undefined) { options.take = args.limit; }
      return await getRepository(User).find(options);
    },
    user: async (parent, args) => {
      return await getRepository(User).findOne(args.id);
    },
  },
  User: {
    shoppingLists: async (parent: User) => {
      return await getRepository(ShoppingList).find({ userId: parent.id });
    },
  },
};
