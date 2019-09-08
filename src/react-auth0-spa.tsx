import React, { useState, useEffect, useContext } from "react";
import createAuth0Client from "@auth0/auth0-spa-js";
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client'

interface IAuthContext {
  getIdTokenClaims: (options?: getIdTokenClaimsOptions) => Promise<IdToken>,
  getTokenSilently: (options?: GetTokenSilentlyOptions) => Promise<any>,
  getTokenWithPopup: (options?: GetTokenWithPopupOptions, config?: PopupConfigOptions) => Promise<string>,
  handleRedirectCallback: () => Promise<void>,
  isAuthenticated: boolean,
  loading: boolean,
  logout: (options?: LogoutOptions) => void,
  loginWithPopup: (options?: PopupLoginOptions, config?: PopupConfigOptions) => Promise<void>,
  loginWithRedirect: (options?: RedirectLoginOptions) => Promise<void>,
  popupOpen: boolean,
  user: {
    email: string,
    emailVerified: boolean,
    name: string,
    picture: string,
  }
}

const DEFAULT_REDIRECT_CALLBACK = (appState: any) =>
  window.history.replaceState({}, document.title, window.location.pathname);

export const Auth0Context = React.createContext<Partial<IAuthContext>>({
  loading: true,
});
export const useAuth0 = () => useContext(Auth0Context);
export const Auth0Provider = ({
  children,
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  ...initOptions
}: { children: any, onRedirectCallback: (appState: any) => void} & Auth0ClientOptions) => {
  const [isAuthenticated, setIsAuthenticated] = useState();
  const [user, setUser] = useState();
  const [auth0Client, setAuth0] = useState<Auth0Client>();
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    const initAuth0 = async () => {
      const auth0FromHook = await createAuth0Client(initOptions);
      setAuth0(auth0FromHook);

      if (window.location.search.includes("code=")) {
        const { appState } = await auth0FromHook.handleRedirectCallback();
        onRedirectCallback(appState);
      }

      const isAuthenticated = await auth0FromHook.isAuthenticated();

      setIsAuthenticated(isAuthenticated);

      if (isAuthenticated) {
        const user = await auth0FromHook.getUser();
        setUser(user);
      }

      setLoading(false);
    };
    initAuth0();
    // eslint-disable-next-line
  }, []);

  const loginWithPopup = async (params = {}) => {
    if (!auth0Client){
      return;
    }

    setPopupOpen(true);
    try {
      await auth0Client.loginWithPopup(params);
    } catch (error) {
      console.error(error);
    } finally {
      setPopupOpen(false);
    }
    const user = await auth0Client.getUser();
    setUser(user);
    setIsAuthenticated(true);
  };

  const handleRedirectCallback = async () => {
    if (!auth0Client) {
      return;
    }

    setLoading(true);
    await auth0Client.handleRedirectCallback();
    const user = await auth0Client.getUser();
    setLoading(false);
    setIsAuthenticated(true);
    setUser(user);
  };

  if (!auth0Client) {
    return null;
  }

  return (
    <Auth0Context.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        popupOpen,
        loginWithPopup,
        handleRedirectCallback,
        getIdTokenClaims: (options?: getIdTokenClaimsOptions) => auth0Client.getIdTokenClaims(options),
        loginWithRedirect: (options?: RedirectLoginOptions) => auth0Client.loginWithRedirect(options),
        getTokenSilently: (options?: GetTokenSilentlyOptions) => auth0Client.getTokenSilently(options),
        getTokenWithPopup: (options?: GetTokenWithPopupOptions, config?: PopupConfigOptions) => auth0Client.getTokenWithPopup(options, config),
        logout: (options?: LogoutOptions) => auth0Client.logout(options)
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};
