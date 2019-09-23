import React from "react";
import { Request } from "express";
import App from "next/app";
import Head from "next/head";
import fetch from "isomorphic-fetch";
import Header from "../components/Header";
import SideMenu from "../components/SideMenu";
import { withStyles } from "@material-ui/styles";
import theme from "../config/theme";
import Router from "next/router";
import { WithApolloProps } from "next-with-apollo";
import { Theme } from "@material-ui/core";
import { AppContextType } from "next-server/dist/lib/utils";
import Root from "../components/Root";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ListItemText from "@material-ui/core/ListItemText";
import CharactersIcon from "../icons/CharactersIcon";
import List from "@material-ui/core/List";
import SideMenuHeader from "../components/SideMenuHeader";

interface IPageProps {
  user?: {
    displayName: string;
    id: string;
    user_id: string;
    emails: Array<{ value: string }>;
    picture: string;
    nickname: string;
  };
}

const styles = (theme: Theme) => ({
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    overflow: "auto"
  },
  root: {
    display: "flex"
  }
});

interface IState {
  sideMenuOpen: boolean;
}

interface IProps extends WithApolloProps<any> {
  classes: any;
}

class EveApp extends App<IProps, IState> {
  readonly state = { sideMenuOpen: false };

  static async getInitialProps({ Component, ctx }: AppContextType) {
    let pageProps: IPageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    const request: Request = ctx.req as Request;

    if (request && request.session && request.session.passport && request.session.passport.user) {
      pageProps.user = request.session.passport.user.profile;
    } else {
      const baseURL = request ? `${request.protocol}://${request.get("Host")}` : "";
      const res = await fetch(`${baseURL}/auth/user`);
      pageProps.user = await res.json();
    }

    return { pageProps };
  }

  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  handleLogoutClick = () => {
    Router.push({
      pathname: "/auth/logout"
    });
  };

  setSideMenuOpen = (open: boolean) => {
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
        <Root>
          {!!pageProps.user && (
            <React.Fragment>
              <Header isAuthenticated={true} title="EVE APP" onLogoutClick={this.handleLogoutClick} user={pageProps.user} />
              <SideMenu
                header={() => (
                  <SideMenuHeader
                    user={{
                      name: pageProps.user.nickname,
                      email: pageProps.user.emails[0].value,
                      picture: pageProps.user.picture
                    }}
                  />
                )}
              >
                <List>
                  <ListItem selected={true} button>
                    <ListItemIcon>
                      <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" primaryTypographyProps={{ noWrap: true }} />
                  </ListItem>
                  <ListItem selected={false} button>
                    <ListItemIcon>
                      <CharactersIcon />
                    </ListItemIcon>
                    <ListItemText primary="Characters" primaryTypographyProps={{ noWrap: true }} />
                  </ListItem>
                </List>
              </SideMenu>
            </React.Fragment>
          )}
          <main className={classes.content}>
            <Component {...pageProps} />
          </main>
        </Root>
      </React.Fragment>
    );
  }
}

export default withStyles(styles(theme))(EveApp);
