import { applicationConfig } from '../applicationConfig';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import ApolloClient from 'apollo-client';
import fetch from 'isomorphic-fetch';

export const createApolloClient: (token?: string) => ApolloClient<NormalizedCacheObject> = (token) => {
  const { config } = applicationConfig;
  const authLink = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }));

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(
      createHttpLink({
        fetch: fetch,
        uri: config.eveApiHost,
      })
    ),
  });
};
