import theme from '../config/theme';
import { ThemeProvider } from '@material-ui/styles';
import React, { useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { LayoutProvider } from '../context/LayoutContext';
import { Theme, makeStyles, createStyles } from '@material-ui/core';
import layoutConfig from '../config/layoutConfig';

const Root: React.FC = ({ children }) => {
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
        {children}
      </LayoutProvider>
    </ThemeProvider>
  );
};

export default Root;
