import { gql } from 'apollo-server-express';
import { getRepository } from 'typeorm';
import { User } from '@entities/User';

export const typeDefs = gql`
    type ShoppingList {
        id: ID!
        user: User!
        creationDate: Date!
        lastUsed: Date
    }
`;

export const resolvers = {
  ShoppingList: {
    user: async (parent) => {
      return await getRepository(User).findOne(parent.userId);
    },
  },
};
