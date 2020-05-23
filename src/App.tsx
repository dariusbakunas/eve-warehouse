import { Login } from "./pages/Login";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import React from "react";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/login" exact component={Login} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
