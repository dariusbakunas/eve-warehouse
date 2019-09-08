import React from 'react';
import { Router, Route, Switch } from "react-router-dom";
import './App.css';
import history from './utils/history';
import PrivateRoute from "./components/PrivateRoute";
import { useAuth0 } from "./react-auth0-spa";
import Profile from "./routes/Profile";
import Home from "./routes/Home";

const App: React.FC = () => {
  const { loading } = useAuth0() || {};

  if (loading) {
    return <div>loading</div>;
  }

  return (
    <Router history={history}>
      <div className="App">
        <Switch>
          <Route path="/" exact component={Home} />
          <PrivateRoute path="/profile" component={Profile} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
