import type { AppProps } from 'next/app'

import { UserProvider } from '@auth0/nextjs-auth0'
import { createTheme, Dropdown, Link, NextUIProvider, Text, Avatar } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { Layout } from '../components/Layout';
import { Navbar } from '../components/Navbar';


export default function App({ Component, pageProps }: AppProps) {
  const { user, isLoading } = pageProps;

  const lightTheme = createTheme({
    type: 'light',
  })

  const darkTheme = createTheme({
    type: 'dark',
  })

  return (
    <UserProvider user={user}>
      <NextThemesProvider
        defaultTheme="system"
        attribute="class"
        value={{
          light: lightTheme.className,
          dark: darkTheme.className
        }}
      >
        <NextUIProvider>
          <Layout>
            <Navbar />
            <Component {...pageProps} />
          </Layout>
        </NextUIProvider>
      </NextThemesProvider>
    </UserProvider>
  )
}
