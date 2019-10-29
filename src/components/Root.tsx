import theme from '../config/theme';
import { ThemeProvider } from '@material-ui/styles';
import React, { useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { LayoutProvider } from '../context/LayoutContext';
import { SnackbarProvider } from 'notistack';
import layoutConfig from '../config/layoutConfig';
import { makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles<Theme>(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
}));

const Root: React.FC = ({ children }) => {
  const classes = useStyles();
  const [opened, setOpened] = useState(false);

  return (
    <ThemeProvider theme={theme}>
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
