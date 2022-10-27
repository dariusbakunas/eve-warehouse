import type { AppProps } from 'next/app'
import { ApolloProvider } from "@apollo/client";
import { UserProvider } from '@auth0/nextjs-auth0'
import client from '../lib/apollo-client';
import {
  AppShell,
  Button,
  Burger, createStyles,
  Footer, Group,
  MantineProvider,
  MediaQuery,
  Text,
} from '@mantine/core';
import { useState } from 'react';
import Head from 'next/head';
import { Navbar } from '../components/Navbar';
import Header from '../components/Header';

export default function App({ Component, pageProps }: AppProps) {
  const { user, isLoading } = pageProps;
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Head>
        <title>Eve Warehouse</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <UserProvider user={user}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            /** Put your mantine theme override here */
            colorScheme: 'dark',
          }}
        >
          <ApolloProvider client={client}>
            <AppShell
              navbarOffsetBreakpoint="sm"
              asideOffsetBreakpoint="sm"
              navbar={
                <Navbar opened={opened}/>
              }
              footer={
                <Footer height={60} p="md">
                  Application footer
                </Footer>
              }
              header={
                <Header opened={opened} onBurgerClick={() => setOpened((o) => !o)}/>
              }
            >
              <Component {...pageProps} />
            </AppShell>
          </ApolloProvider>
        </MantineProvider>
      </UserProvider>
    </>
  )
}
