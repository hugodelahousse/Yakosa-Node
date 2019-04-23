import { ApolloServer, makeExecutableSchema, gql } from 'apollo-server-express';
import { GraphQLScalarType, Kind } from 'graphql';
import { typeDefs as userTypeDefs, resolvers as userResolvers } from '@graphql/user';
import {
  typeDefs as shoppingListTypeDefs,
  resolvers as shoppingListResolvers,
} from '@graphql/shoppingList';
import { all as deepmerge } from 'deepmerge';

const typeDef = gql`
  directive @UUID (
      name: String! = "uid"
      from: [String!]! = ["id"]
  ) on OBJECT
  scalar Date
`;

const dateResolver = {
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

const schema = makeExecutableSchema({
  typeDefs: [
    userTypeDefs,
    shoppingListTypeDefs,
    typeDef,
  ],
  resolvers: deepmerge([dateResolver, userResolvers, shoppingListResolvers]),
  schemaDirectives: {},
});

const apollo = new ApolloServer({ schema });

export default apollo;
