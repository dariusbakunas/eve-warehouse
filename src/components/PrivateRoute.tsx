import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth0 } from "../react-auth0-spa";
import { RouteProps } from 'react-router'

const PrivateRoute = (props: RouteProps) => {
  const { path, component, ...rest } = props;

  const context = useAuth0();
  const { isAuthenticated, loginWithRedirect, user } = context || {};
  const { pathname } = props.location || {};

  useEffect(() => {
    const fn = async () => {
      if (!isAuthenticated && loginWithRedirect) {
        await loginWithRedirect({
          appState: { targetUrl: path }
        });
      }
    };
    fn();
  }, [isAuthenticated, loginWithRedirect, path]);

  if (pathname !== '/verify-email' && isAuthenticated && user && !user.email_verified) {
    console.log(user);
    return (<Redirect to="/verify-email"/>);
  }

  const render = (renderProps: any) => isAuthenticated && component ? React.createElement(component, renderProps) : null;

  return (<Route path={path} render={render} {...rest} />);
};

export default PrivateRoute;
