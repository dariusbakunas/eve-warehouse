import { FC, useCallback, useState } from 'react';
import {
  Avatar,
  Burger,
  Button,
  Group,
  MediaQuery,
  Text,
  Header as MantineHeader,
  useMantineTheme,
  UnstyledButton,
  createStyles, Menu
} from '@mantine/core';

import {
  IconLogout,
  IconHeart,
  IconStar,
  IconMessage,
  IconSettings,
  IconPlayerPause,
  IconTrash,
  IconSwitchHorizontal,
  IconChevronDown,
} from '@tabler/icons';

import { useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router'

const useStyles = createStyles((theme) => ({
  hiddenMobile: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  hiddenDesktop: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  user: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    borderRadius: theme.radius.sm,
    transition: 'background-color 100ms ease',

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
    },

    [theme.fn.smallerThan('xs')]: {
      display: 'none',
    },
  },

  userActive: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
  },
}));

const Header: FC<{ onBurgerClick?: () => void, opened: boolean }> = ({ onBurgerClick, opened }) => {
  const { user, isLoading } = useUser();
  const router = useRouter()
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const { classes, theme, cx } = useStyles();

  const handleBurgerClick = useCallback(() => {
    if (onBurgerClick) {
      onBurgerClick();
    }
  }, [onBurgerClick])

  return (
    <MantineHeader height={70} p="md">
      <Group position="apart" sx={{ height: '100%' }}>
        <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
          <Burger
            opened={opened}
            onClick={handleBurgerClick}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />
        </MediaQuery>

        <Text>Eve Warehouse</Text>
        {!user && !isLoading &&
          <Group className={classes.hiddenMobile}>
            <Button variant="default" onClick={() => router.push('/api/auth/login')}>Log in</Button>
            <Button>Sign up</Button>
          </Group>
        }
        {user &&
          <Menu
            width={260}
            position="bottom-end"
            transition="pop-top-right"
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
          >
            <Menu.Target>
              <UnstyledButton
                className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
              >
                <Group spacing={7}>
                  {user.picture && <Avatar src={user.picture} alt={user.name || user.nickname || "Unknown User"} radius="xl" size={20} />}
                  <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                    {user.name}
                  </Text>
                  <IconChevronDown size={12} stroke={1.5} />
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Settings</Menu.Label>
              <Menu.Item icon={<IconSettings size={14} stroke={1.5} />}>Account settings</Menu.Item>
              <Menu.Item icon={<IconSwitchHorizontal size={14} stroke={1.5} />}>
                Change account
              </Menu.Item>
              <Menu.Item icon={<IconLogout size={14} stroke={1.5}/>} onClick={() => router.push('/api/auth/logout')}>Logout</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        }
      </Group>
    </MantineHeader>
  )
}

export default Header;