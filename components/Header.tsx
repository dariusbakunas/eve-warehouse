import { FC, useCallback } from 'react';
import {
  Burger,
  Button,
  Group,
  MediaQuery,
  Text,
  Header as MantineHeader,
  useMantineTheme,
  createStyles
} from '@mantine/core';
import { useUser } from '@auth0/nextjs-auth0';

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
}));

const Header: FC<{ onBurgerClick?: () => void, opened: boolean }> = ({ onBurgerClick, opened }) => {
  const { user, isLoading } = useUser();
  const { classes, theme } = useStyles();

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
        {!user &&
          <Group className={classes.hiddenMobile}>
            <Button variant="default">Log in</Button>
            <Button>Sign up</Button>
          </Group>
        }
      </Group>
    </MantineHeader>
  )
}

export default Header;