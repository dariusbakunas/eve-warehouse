import React from "react";
import App from "next/app";
import Head from "next/head";
import fetch from "isomorphic-fetch";
import Header from "../components/Header";
import SideMenu from "../components/SideMenu";
import { withStyles } from "@material-ui/styles";
import { ThemeProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "../theme";
import Router from "next/router";

interface IPageProps {
  user?: any;
}

const styles = theme => ({
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto"
  },
  root: {
    display: "flex"
  },
});

interface IState {
  sideMenuOpen: boolean;
}

class EveApp extends App<{ classes: any }, IState> {
  readonly state = { sideMenuOpen: false };

  static async getInitialProps({ Component, ctx }) {
    let pageProps: IPageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    if (ctx.req && ctx.req.session.passport) {
      pageProps.user = ctx.req.session.passport.user;
    } else {
      const baseURL = ctx.req ? `${ctx.req.protocol}://${ctx.req.get("Host")}` : "";
      const res = await fetch(`${baseURL}/auth/user`);
      pageProps.user = await res.json();
    }

    return { pageProps };
  }

  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  handleLogoutClick = () => {
    Router.push({
      pathname: "/auth/logout"
    });
  };

  setSideMenuOpen = open => {
    this.setState({
      sideMenuOpen: open
    });
  };

  render() {
    const { classes, Component, pageProps } = this.props;

    return (
      <React.Fragment>
        <Head>
          <title>Eve APP</title>
        </Head>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <div className={classes.root}>
            {!!pageProps.user && (
              <React.Fragment>
                <Header isAuthenticated={true} title="EVE APP" sideMenuOpen={this.state.sideMenuOpen} onSideMenuOpen={() => this.setSideMenuOpen(true)} onLogoutClick={this.handleLogoutClick} sideMenuEnabled={true} />
                <SideMenu sideMenuOpen={this.state.sideMenuOpen} onSideMenuClose={() => this.setSideMenuOpen(false)} />
              </React.Fragment>
            )}
            <main className={classes.content}>
              <div className={classes.appBarSpacer} />
              <Component {...pageProps} />
            </main>
          </div>
        </ThemeProvider>
      </React.Fragment>
    );
  }
}

export default withStyles(styles(theme))(EveApp);
