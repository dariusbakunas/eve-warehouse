import { ApplicationStateProvider } from '../context/ApplicationContext';
import { IUser } from '../auth/auth0Verify';
import { LayoutProvider } from '../context/LayoutContext';
import { makeStyles, Theme } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@material-ui/styles';
import { useRouter } from 'next/router';
import CssBaseline from '@material-ui/core/CssBaseline';
import IdleTimer from 'react-idle-timer';
import layoutConfig from '../config/layoutConfig';
import React, { useCallback, useRef, useState } from 'react';
import theme from '../config/theme';

const useStyles = makeStyles<Theme>(theme => ({
  root: {
    display: 'flex',
    minHeight: '100vh',
  },
}));

interface IProps {
  user?: IUser;
}

const Root: React.FC<IProps> = ({ children, user }) => {
  const router = useRouter();
  const classes = useStyles();
  const idleTimer = useRef(null);
  const [opened, setOpened] = useState(false);

  const onIdle = useCallback(() => {
    router.push('/auth/logout');
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {/*{user && typeof document !== 'undefined' && (*/}
      {/*  <IdleTimer ref={idleTimer} element={document} onIdle={onIdle} debounce={250} timeout={1000 * 60 * 15} />*/}
      {/*)}*/}
      <LayoutProvider
        value={{
          ...layoutConfig,
          opened,
          setOpened,
        }}
      >
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <SnackbarProvider maxSnack={3}>
          <div className={classes.root}>
            <ApplicationStateProvider>{children}</ApplicationStateProvider>
          </div>
        </SnackbarProvider>
      </LayoutProvider>
    </ThemeProvider>
  );
};

export default Root;
