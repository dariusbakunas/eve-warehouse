import "./App.scss";
import "./index.scss";
import { ApolloProvider } from "@apollo/react-hooks";
import { BrowserRouter as Router } from "react-router-dom";
import ApolloClient, { InMemoryCache } from "apollo-boost";
import App from "./App";
import React from "react";
import ReactDOM from "react-dom";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "/api",
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Router>
        <App />
      </Router>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
