import React from 'react';
import { Request } from 'express';
import App, { AppContext } from 'next/app';
import Head from 'next/head';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import { withStyles } from '@material-ui/styles';
import theme from '../config/theme';
import Router from 'next/router';
import { WithApolloProps } from 'next-with-apollo';
import { Theme } from '@material-ui/core';
import Root from '../components/Root';
import getCurrentUser from '../auth/getCurrentUser';
import { IUser } from '../auth/auth0Verify';

interface IPageProps {
  user?: IUser;
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
  appBarSpacer: theme.mixins.toolbar,
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
          <title>Eve APP</title>
        </Head>
        <Root user={pageProps.user}>
          {!!pageProps.user && pageProps.user.status === 'ACTIVE' && (
            <React.Fragment>
              <Header isAuthenticated={true} title="EVE APP" onLogoutClick={() => this.handleNavigate('/auth/logout')} user={pageProps.user} />
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
