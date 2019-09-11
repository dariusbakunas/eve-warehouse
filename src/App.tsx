import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Route, Switch, RouteComponentProps } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import { withRouter } from "react-router";
import Header from "./components/Header";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import "./App.css";
import PrivateRoute from "./components/PrivateRoute";
import SideMenu from "./components/SideMenu";
import { useAuth0 } from "./react-auth0-spa";
import Profile from "./routes/Profile";
import Home from "./routes/Home";
import VerifyEmail from "./routes/VerifyEmail";
import { useQuery } from "@apollo/react-hooks";
import { testQuery } from "./queries";

const useStyles = makeStyles(theme => ({
  appBarSpacer: theme.mixins.toolbar,
  root: {
    display: "flex"
  },
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto"
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  }
}));

const App: React.FC<RouteComponentProps> = ({ location }) => {
  const [open, setOpen] = React.useState(false);
  const [token, setToken] = React.useState<string>();
  const classes = useStyles();
  const { loading, isAuthenticated = false, auth0Client } = useAuth0() || {};
  const { getTokenSilently, loginWithRedirect, logout } = auth0Client || {};

  const { loading: gqlLoading } = useQuery(testQuery, {
    skip: !isAuthenticated || !token,
    context: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  });

  useEffect(() => {
    const getToken = async () => {
      if (isAuthenticated && getTokenSilently) {
        const newToken = await getTokenSilently();
        console.log(newToken);
        setToken(newToken);
      }
    };

    getToken();
  }, [isAuthenticated, !!getTokenSilently]);

  const authCookieExists = !!document.cookie.split(";").filter(function(item) {
    return item.indexOf("auth0.is.authenticated=true") >= 0;
  }).length;

  useEffect(() => {
    if (authCookieExists && loginWithRedirect && !isAuthenticated && !loading) {
      loginWithRedirect({
        appState: { targetUrl: location.pathname }
      });
    }
  }, [authCookieExists, !!loginWithRedirect, isAuthenticated, loading]);

  const handleLoginClick = async () => {
    if (!isAuthenticated && loginWithRedirect) {
      await loginWithRedirect({
        appState: { targetUrl: location.pathname }
      });
    }
  };

  const handleLogoutClick = () => {
    if (logout) {
      logout();
    }
  };

  return (
    <div className={classes.root}>
      <Header
        isAuthenticated={isAuthenticated}
        onLoginClick={handleLoginClick}
        onLogoutClick={handleLogoutClick}
        onSideMenuOpen={() => setOpen(true)}
        sideMenuOpen={open}
        sideMenuEnabled={false}
        title="Eve Toolkit"
      />
      {(loading || gqlLoading) && (
        <Grid container spacing={0} direction="column" alignItems="center" justify="center" style={{ minHeight: "100vh" }}>
          <Grid item xs={3}>
            <CircularProgress />
          </Grid>
        </Grid>
      )}
      {/* disable side menu for now */}
      {isAuthenticated && false && <SideMenu sideMenuOpen={open} onSideMenuClose={() => setOpen(false)} />}
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Switch>
            <Route path="/" exact component={Home} />
            <PrivateRoute path="/verify-email" component={VerifyEmail} />
            <PrivateRoute path="/profile" component={Profile} />
          </Switch>
        </Container>
      </main>
    </div>
  );
};

export default withRouter(App);
