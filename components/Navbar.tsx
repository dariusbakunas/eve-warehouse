import { FC, Key, useCallback } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';
import {
  createStyles,
  Navbar as MantineNavbar,
} from '@mantine/core';
import { IconUser, IconLogout } from '@tabler/icons';

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef('icon');
  return {
    footer: {
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderTop: `1px solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
      }`,
    },
    link: {
      ...theme.fn.focusStyles(),
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      fontSize: theme.fontSizes.sm,
      color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      '&:hover': {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,

        [`& .${icon}`]: {
          color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        },
      },
    },
    linkIcon: {
      ref: icon,
      color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
      marginRight: theme.spacing.sm,
    },
    linkActive: {
      '&, &:hover': {
        backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor })
          .background,
        color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
        [`& .${icon}`]: {
          color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
        },
      },
    },
  }
})

const data = [
  { link: '/characters', label: 'Characters', icon: IconUser },
];

export const Navbar: FC<{ opened: boolean }> = ({ opened }) => {
  const { user, isLoading } = useUser();
  const { classes, cx } = useStyles();
  const router = useRouter();

  const links = data.map((item) => (
    <a
      className={cx(classes.link, { [classes.linkActive]: item.link === router.pathname })}
      href={item.link}
      key={item.label}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  const handleMenuClick = useCallback((actionKey: Key) => {
    if (actionKey == "logout") {
      router.push("/api/auth/logout")
    }
  }, [router]);

  return (
    <MantineNavbar p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }} hidden={!opened}>
      <MantineNavbar.Section grow>
        {links}
      </MantineNavbar.Section>
      <MantineNavbar.Section className={classes.footer}>
        <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </MantineNavbar.Section>
    </MantineNavbar>
  )
}