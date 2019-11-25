import theme from '../config/theme';
import { ThemeProvider } from '@material-ui/styles';
import React, { useRef, useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { LayoutProvider } from '../context/LayoutContext';
import { SnackbarProvider } from 'notistack';
import layoutConfig from '../config/layoutConfig';
import IdleTimer from 'react-idle-timer';
import { makeStyles, Theme } from '@material-ui/core';
import {IUser} from '../auth/auth0Verify';
import { useRouter } from 'next/router';

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

  const onActive = () => {};

  const onIdle = () => {
    router.push('/auth/logout');
  };

  const onAction = () => {};

  return (
    <ThemeProvider theme={theme}>
      {user && typeof document !== 'undefined' && (
        <IdleTimer
          ref={idleTimer}
          element={document}
          onActive={onActive}
          onIdle={onIdle}
          onAction={onAction}
          debounce={250}
          timeout={1000 * 60 * 15}
        />
      )}
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
          <div className={classes.root}>{children}</div>
        </SnackbarProvider>
      </LayoutProvider>
    </ThemeProvider>
  );
};

export default Root;
