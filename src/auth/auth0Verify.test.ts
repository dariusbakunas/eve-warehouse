import { addMockFunctionsToSchema, IMocks, IResolvers, makeExecutableSchema } from 'graphql-tools';
import { GraphQLSchema } from 'graphql';
import { InMemoryCache } from 'apollo-boost';
import { SchemaLink } from 'apollo-link-schema';
import ApolloClient from 'apollo-client';
import auth0Verify from './auth0Verify';
import createApolloClient from '../lib/createApolloClient';
import faker from 'faker';

jest.mock('../lib/createApolloClient');

const createApolloClientMock = (createApolloClient as unknown) as jest.MockedFunction<typeof createApolloClient>;

const typeDefs = `
  enum UserStatus {
    ACTIVE
    INACTIVE
    NOT_VERIFIED
  }
  type User {
    id: ID!
    username: String!
    email: String!
    status: UserStatus!
  }
  type Query {
    userByEmail(email: String!): User
  }
`;

let schema: GraphQLSchema;

describe('auth0Verify', () => {
  beforeEach(() => {
    const mocks = {
      Query: {
        userByEmail: () => ({
          id: faker.random.uuid(),
          username: 'TEST_USER',
          email: 'test@gmail.com',
          status: 'ACTIVE',
        }),
      },
    };

    jest.spyOn(Date, 'now').mockImplementation(() => new Date(2010, 1, 2).getTime());

    schema = makeExecutableSchema({ typeDefs, resolvers: mocks });
    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: new SchemaLink({ schema }),
    });

    createApolloClientMock.mockReturnValue(client);
  });

  it('gets user from graphql', async () => {
    const doneMock = jest.fn();
    await auth0Verify(
      'TEST_ACCESS_TOKEN',
      'TEST_REFRESH_TOKEN',
      // eslint-disable-next-line @typescript-eslint/camelcase
      { expires_in: 10000 },
      {
        emails: [{ value: 'test@gmail.com' }],
        picture: 'test_picture.png',
      },
      doneMock
    );

    expect(doneMock).toHaveBeenCalledWith(null, {
      accessToken: 'TEST_ACCESS_TOKEN',
      refreshToken: 'TEST_REFRESH_TOKEN',
      expiresAt: 1265078800000,
      email: 'test@gmail.com',
      picture: 'test_picture.png',
      status: 'ACTIVE',
    });
  });
});
