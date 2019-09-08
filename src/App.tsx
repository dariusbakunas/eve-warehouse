import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Router, Route, Switch } from "react-router-dom";
import Header from './components/Header';
import Container from '@material-ui/core/Container';
import './App.css';
import history from './utils/history';
import PrivateRoute from "./components/PrivateRoute";
import SideMenu from "./components/SideMenu";
import { useAuth0 } from "./react-auth0-spa";
import Profile from "./routes/Profile";
import Home from "./routes/Home";
import VerifyEmail from './routes/VerifyEmail';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  appBarSpacer: theme.mixins.toolbar,
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

const App: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const { loading } = useAuth0() || {};

  if (loading) {
    return <div>loading</div>;
  }

  return (
    <Router history={history}>
      <div className={classes.root}>
        <Header sideMenuOpen={open} onSideMenuOpen={() => setOpen(true)}/>
        <SideMenu sideMenuOpen={open} onSideMenuClose={() => setOpen(false)}/>
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
    </Router>
  );
}

export default App;
