import "./App.scss";
import "./index.scss";
import { ApolloProvider } from "@apollo/react-hooks";
import { NotificationProvider } from "./components/Notifications/NotificationProvider";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { store } from "./redux/store";
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
    <Provider store={store}>
      <ApolloProvider client={client}>
        <Router>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </Router>
      </ApolloProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
