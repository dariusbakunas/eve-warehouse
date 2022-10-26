import type { AppProps } from 'next/app'

import { UserProvider } from '@auth0/nextjs-auth0'
import { createTheme, NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export default function App({ Component, pageProps }: AppProps) {
  const { user } = pageProps;

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
        <Component {...pageProps} />
      </NextUIProvider>
      </NextThemesProvider>
    </UserProvider>
  )
}
