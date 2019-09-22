import theme from "../config/theme";
import { ThemeProvider } from "@material-ui/styles";
import React, { useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { LayoutProvider } from "../context/LayoutContext";
import { Theme, makeStyles, createStyles } from "@material-ui/core";
import layoutConfig from "../config/layoutConfig";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex"
    }
  })
);

const Root: React.FC = ({ children }) => {
  const classes = useStyles();
  const [opened, setOpened] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <LayoutProvider
        value={{
          ...layoutConfig,
          opened,
          setOpened
        }}
      >
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <div className={classes.root}>{children}</div>
      </LayoutProvider>
    </ThemeProvider>
  );
};

export default Root;
