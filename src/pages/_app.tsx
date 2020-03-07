import { IClientEnv } from '../server';
import { IUser } from '../auth/auth0Verify';
import { Request } from 'express';
import { Theme } from '@material-ui/core';
import { WithApolloProps } from 'next-with-apollo';
import { withStyles } from '@material-ui/styles';
import App, { AppContext } from 'next/app';
import getClientEnv from '../auth/getClientEnv';
import getCurrentUser from '../auth/getCurrentUser';
import Head from 'next/head';
import Header from '../components/Header';
import React from 'react';
import Root from '../components/Root';
import Router from 'next/router';
import SideMenu from '../components/SideMenu';
import theme from '../config/theme';

export interface IPageProps {
  user?: IUser;
  env?: IClientEnv;
}

const styles = (theme: Theme) => ({
  '@global': {
    html: {
      height: '100vh',
    },
    body: {
      minHeight: '100vh',
    },
    '#__next': {
      minHeight: '100vh',
    },
  },
  appBarSpacer: {
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
  },
});

interface IState {
  sideMenuOpen: boolean;
}

interface IProps extends WithApolloProps<any> {
  classes: any;
}

class EveApp extends App<IProps, IState> {
  static async getInitialProps({ Component, ctx }: AppContext) {
    let pageProps: IPageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    const request: Request = ctx.req as Request;
    pageProps.user = await getCurrentUser(request);
    pageProps.env = await getClientEnv(request);

    return { pageProps };
  }

  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  handleNavigate = (url: string) => {
    Router.push({
      pathname: url,
    });
  };

  render() {
    const { classes, Component, pageProps } = this.props;

    return (
      <React.Fragment>
        <Head>
          <title>Eve Warehouse</title>
        </Head>
        <Root user={pageProps.user}>
          {!!pageProps.user && pageProps.user.status === 'ACTIVE' && (
            <React.Fragment>
              <Header isAuthenticated={true} title="EVE WAREHOUSE" onLogoutClick={() => this.handleNavigate('/auth/logout')} user={pageProps.user} />
              <SideMenu />
            </React.Fragment>
          )}
          <main className={classes.content}>
            {pageProps.user && pageProps.user.status === 'ACTIVE' && <div className={classes.appBarSpacer} />}
            <Component {...pageProps} />
          </main>
        </Root>
      </React.Fragment>
    );
  }
}

export default withStyles(styles(theme))(EveApp);
