import type { AppProps } from 'next/app'
import { ApolloProvider } from "@apollo/client";
import { UserProvider } from '@auth0/nextjs-auth0'
import client from '../lib/apollo-client';
import {
  AppShell,
  Burger,
  Footer,
  Header,
  MantineProvider,
  MediaQuery,
  Text,
  useMantineTheme
} from '@mantine/core';
import { useState } from 'react';
import Head from 'next/head';
import { Navbar } from '../components/Navbar';


export default function App({ Component, pageProps }: AppProps) {
  const { user, isLoading } = pageProps;
  const theme = useMantineTheme();
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
                <Header height={70} p="md">
                  <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                      <Burger
                        opened={opened}
                        onClick={() => setOpened((o) => !o)}
                        size="sm"
                        color={theme.colors.gray[6]}
                        mr="xl"
                      />
                    </MediaQuery>

                    <Text>Application header</Text>
                  </div>
                </Header>
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
