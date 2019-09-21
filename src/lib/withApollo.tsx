import React, { useMemo } from "react";
import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloClient, InMemoryCache, HttpLink, NormalizedCacheObject } from "apollo-boost";
import { NextComponentType } from "next";
import Head from "next/head";
import { AppContext } from "next/app";

export interface ApolloContext<C = any> extends AppContext {
  AppTree: any;
}

// client-side
let apolloClient: ApolloClient<NormalizedCacheObject>;

const initApolloClient = (initialState = {}) => {
  if (typeof window === "undefined") {
    console.log("Creating ApolloClient server side");

    // server-side
    return new ApolloClient({
      cache: new InMemoryCache().restore(initialState || {}),
      link: new HttpLink({
        uri: "http://localhost:4000/graphql"
      }),
      connectToDevTools: false,
      ssrMode: true
    });
  } else {
    if (!apolloClient) {
      console.log("Creating ApolloClient client side");

      // client-side
      apolloClient = new ApolloClient({
        cache: new InMemoryCache().restore(initialState || {}),
        connectToDevTools: false,
        link: new HttpLink({
          uri: "/api"
        }),
        ssrMode: true
      });
    }

    return apolloClient;
  }
};

const withApollo = <P extends object>(PageComponent: NextComponentType<ApolloContext, {}, P>) => {
  const WithApollo: NextComponentType<ApolloContext, {}, P & { apolloClient: ApolloClient<NormalizedCacheObject>; apolloState: any }> = ({
    apolloClient,
    apolloState,
    ...pageProps
  }) => {
    const client = useMemo(() => apolloClient || initApolloClient(apolloState), []);

    return (
      <ApolloProvider client={client}>
        <PageComponent {...(pageProps as P)} />
      </ApolloProvider>
    );
  };

  if (typeof window === "undefined") {
    WithApollo.getInitialProps = async (ctx: ApolloContext) => {
      const { AppTree } = ctx;

      let pageProps = {};
      if (PageComponent.getInitialProps) {
        pageProps = await PageComponent.getInitialProps(ctx);
      }

      // Run all GraphQL queries in the component tree
      // and extract the resulting data
      const apolloClient = initApolloClient();

      try {
        console.log("Executing queries server-side");

        // Run all GraphQL queries
        await require("@apollo/react-ssr").getDataFromTree(
          <AppTree
            pageProps={{
              ...pageProps,
              apolloClient
            }}
          />
        );
      } catch (error) {
        // Prevent Apollo Client GraphQL errors from crashing SSR.
        // Handle them in components via the data.error prop:
        // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
        console.error("Error while running `getDataFromTree`", error);
      }

      // getDataFromTree does not call componentWillUnmount
      // head side effect therefore need to be cleared manually
      Head.rewind();

      // Extract query data from the Apollo store
      const apolloState = apolloClient.cache.extract();

      return {
        ...pageProps,
        apolloState
      };
    };
  }

  return WithApollo;
};

export default withApollo;
