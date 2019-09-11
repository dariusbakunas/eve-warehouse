import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import "typeface-roboto";
import * as serviceWorker from "./serviceWorker";
import { ThemeProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Auth0Provider } from "./react-auth0-spa";
import history from "./utils/history";
import theme from "./theme";
import { Router } from "react-router-dom";
import apolloClient from "./apolloClient";
import { ApolloProvider } from "@apollo/react-hooks";

if (!process.env.REACT_APP_AUTH0_DOMAIN) {
  throw new Error("process.env.REACT_APP_AUTH0_DOMAIN is required");
}

if (!process.env.REACT_APP_AUTH0_CLIENT_ID) {
  throw new Error("process.env.REACT_APP_AUTH0_CLIENT_ID is required");
}

const onRedirectCallback = (appState: any) => {
  history.push(appState && appState.targetUrl ? appState.targetUrl : window.location.pathname);
};

ReactDOM.render(
  <Auth0Provider
    audience={process.env.REACT_APP_AUTH0_AUDIENCE}
    domain={process.env.REACT_APP_AUTH0_DOMAIN}
    client_id={process.env.REACT_APP_AUTH0_CLIENT_ID}
    redirect_uri={window.location.origin}
    onRedirectCallback={onRedirectCallback}
  >
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router history={history}>
          <App />
        </Router>
      </ThemeProvider>
    </ApolloProvider>
  </Auth0Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
