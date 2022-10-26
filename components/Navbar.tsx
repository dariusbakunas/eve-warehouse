import { Key, useCallback } from 'react';
import { Navbar as NextBar } from '@nextui-org/react';
import { Avatar, Dropdown, Link, Text } from '@nextui-org/react';
import { useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';

export const Navbar = () => {
  const { user, isLoading } = useUser();
  const router = useRouter();

  const handleMenuClick = useCallback((actionKey: Key) => {
    if (actionKey == "logout") {
      router.push("/api/auth/logout")
    }
  }, [router]);

  return (
    <NextBar isBordered variant="sticky" isCompact={true} maxWidth="fluid">
      <NextBar.Brand>
        <NextBar.Toggle aria-label="toggle navigation" />
        <Text b color="inherit" hideIn="xs">
          Eve Warehouse
        </Text>
      </NextBar.Brand>
      <NextBar.Content hideIn="xs" variant="underline">
        <NextBar.Link href="/characters">Characters</NextBar.Link>
      </NextBar.Content>
      <NextBar.Content>
        {!isLoading && !user && (
          <NextBar.Link color="inherit" href="/api/auth/login">
            Login
          </NextBar.Link>
        )}

        {user && (
          <NextBar.Content
            css={{
              "@xs": {
                w: "12%",
                jc: "flex-end",
              },
            }}
          >
            <Dropdown placement="bottom-right">
              <NextBar.Item>
                <Dropdown.Trigger>
                  <Avatar
                    bordered
                    as="button"
                    color="secondary"
                    size="md"
                    src={user.picture || `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${user.name || user.nickname}`}
                  />
                </Dropdown.Trigger>
              </NextBar.Item>
              <Dropdown.Menu
                aria-label="User menu actions"
                color="secondary"
                onAction={handleMenuClick}
              >
                <Dropdown.Item key="profile" css={{ height: "$18" }}>
                  <Text b color="inherit" css={{ d: "flex" }}>
                    Signed in as
                  </Text>
                  <Text b color="inherit" css={{ d: "flex" }}>
                    {user.name || user.nickname}
                  </Text>
                </Dropdown.Item>
                <Dropdown.Item key="settings" withDivider>
                  Profile
                </Dropdown.Item>
                <Dropdown.Item key="logout" withDivider color="error">
                  Log Out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </NextBar.Content>
        )}
      </NextBar.Content>
      <NextBar.Collapse>
        <NextBar.CollapseItem>
          <Link
            color="inherit"
            css={{
              minWidth: "100%",
            }}
            href="#"
          >
            Characters
          </Link>
        </NextBar.CollapseItem>
      </NextBar.Collapse>
    </NextBar>
  )
}