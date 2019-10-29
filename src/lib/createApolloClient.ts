import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { setContext } from 'apollo-link-context';
import { HttpLink } from 'apollo-link-http';

const createApolloClient: (token?: string) => ApolloClient<NormalizedCacheObject> = token => {
  const authLink = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }));

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(
      new HttpLink({
        uri: process.env.EVE_API_HOST,
      })
    ),
  });
};

export default createApolloClient;
