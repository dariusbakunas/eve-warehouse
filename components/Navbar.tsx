import { FC, Key, useCallback } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';
import {
  Navbar as MantineNavbar,
  Text
} from '@mantine/core';

export const Navbar: FC<{ opened: boolean }> = ({ opened }) => {
  const { user, isLoading } = useUser();
  const router = useRouter();

  const routes = [
    { pathname: "/characters", label: "Characters" },
    { pathname: "/wallet", label: "Wallet" },
  ]

  const handleMenuClick = useCallback((actionKey: Key) => {
    if (actionKey == "logout") {
      router.push("/api/auth/logout")
    }
  }, [router]);

  return (
    <MantineNavbar p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }} hidden={!opened}>
      <Text>Navbar</Text>
    </MantineNavbar>
  )
}