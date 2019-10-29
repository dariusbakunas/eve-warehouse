import React, { useMemo } from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  NormalizedCacheObject,
} from 'apollo-boost';
import { NextComponentType, NextPageContext } from 'next';
import Head from 'next/head';
import { setContext } from 'apollo-link-context';
import { IncomingMessage } from 'http';

export interface ApolloContext<C = any> extends NextPageContext {
  AppTree: any;
}

// client-side
let sharedClient: ApolloClient<NormalizedCacheObject>;

const initApolloClient = (ctx: NextPageContext | null, initialState = {}) => {
  if (typeof window === 'undefined') {
    const request = ctx ? ctx.req as IncomingMessage & { user?: any } : null;

    // @ts-ignore
    const token = request && request.user ? request.user.accessToken : null;

    const authLink = setContext((_, { headers }) => ({
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    }));

    // server-side
    return new ApolloClient({
      cache: new InMemoryCache().restore(initialState || {}),
      link: authLink.concat(
        new HttpLink({
          uri: process.env.EVE_API_HOST,
        })
      ),
      connectToDevTools: false,
      ssrMode: true,
    });
  }
  if (!sharedClient) {
    // client-side
    sharedClient = new ApolloClient({
      cache: new InMemoryCache().restore(initialState || {}),
      connectToDevTools: true,
      link: new HttpLink({
        uri: '/api',
      }),
      ssrMode: true,
    });
  }

  return sharedClient;
};

const withApollo = <P extends object>(
  PageComponent: NextComponentType<ApolloContext, {}, P>
) => {
  const WithApollo: NextComponentType<
    ApolloContext,
    {},
    P & { apolloClient: ApolloClient<NormalizedCacheObject>; apolloState: any }
  > = ({ apolloClient, apolloState, ...pageProps }) => {
    const client = useMemo(
      () => apolloClient || initApolloClient(null, apolloState),
      []
    );

    return (
      <ApolloProvider client={client}>
        <PageComponent {...(pageProps as P)} />
      </ApolloProvider>
    );
  };

  if (typeof window === 'undefined') {
    WithApollo.getInitialProps = async (ctx: ApolloContext) => {
      const { AppTree } = ctx;

      let pageProps = {};
      if (PageComponent.getInitialProps) {
        pageProps = await PageComponent.getInitialProps(ctx);
      }

      if (ctx && ctx.res && (ctx.res.headersSent || ctx.res.finished)) {
        return {};
      }

      const serverClient = initApolloClient(ctx);

      try {
        // Run all GraphQL queries
        // eslint-disable-next-line global-require
        await require('@apollo/react-ssr').getDataFromTree(
          <AppTree
            pageProps={{
              ...pageProps,
              serverClient,
            }}
          />
        );
      } catch (error) {
        // Prevent Apollo Client GraphQL errors from crashing SSR.
        // Handle them in components via the data.error prop:
        // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
        console.error('Error while running `getDataFromTree`', error);
      }

      // getDataFromTree does not call componentWillUnmount
      // head side effect therefore need to be cleared manually
      Head.rewind();

      // Extract query data from the Apollo store
      const apolloState = serverClient.cache.extract();

      return {
        ...pageProps,
        apolloState,
      };
    };
  } else {
    WithApollo.getInitialProps = async (ctx: NextPageContext) => {
      const { getInitialProps } = PageComponent;

      let appProps = {};

      if (getInitialProps) {
        appProps = await getInitialProps(ctx);
      }

      return {
        ...appProps,
      };
    };
  }

  return WithApollo;
};

export default withApollo;
