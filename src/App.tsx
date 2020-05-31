import { Characters } from "./pages/Characters";
import { getAppConfig, getCurrentUser } from "./api";
import { Header, HeaderGlobalAction, HeaderGlobalBar, HeaderName, Loading } from "carbon-components-react";
import { Login } from "./pages/Login";
import { Logout20 } from "@carbon/icons-react";
import { Redirect, Route, Switch } from "react-router-dom";
import { Register } from "./pages/Register";
import { RootState } from "./redux/reducers";
import { setAppConfig, setUser } from "./redux/actions";
import { useDispatch, useSelector } from "react-redux";
import React, { useCallback, useEffect, useState } from "react";

const DEV = process.env.NODE_ENV === "development";

function App() {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector<RootState, RootState["auth"]>((state) => state.auth);
  const dispatch = useDispatch();
  const [error, setError] = useState<Error>();

  const logout = useCallback(() => {
    window.location.href = DEV ? "http://localhost:3001/auth/logout" : "/auth/logout";
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [appConfig, user] = await Promise.all([getAppConfig(), getCurrentUser()]);

        dispatch(
          setAppConfig({
            eveClientId: appConfig.EVE_CLIENT_ID,
            eveLoginUrl: appConfig.EVE_LOGIN_URL,
            eveApiHost: appConfig.EVE_API_HOST,
            eveCharacterRedirectUrl: appConfig.EVE_CHARACTER_REDIRECT_URL,
          })
        );

        dispatch(setUser(user));
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  return (
    <div className="App">
      <Loading active={loading} />
      {user && user.status === "ACTIVE" && (
        <Header aria-label="Eve Warehouse">
          <HeaderName href="#" prefix="EVE">
            Warehouse
          </HeaderName>
          <HeaderGlobalBar>
            <HeaderGlobalAction aria-label="Logout" onClick={logout}>
              <Logout20 />
            </HeaderGlobalAction>
          </HeaderGlobalBar>
        </Header>
      )}
      {error && <Redirect to={{ pathname: "/login" }} />}
      {user && user.status === "GUEST" && <Redirect to={{ pathname: "/register" }} />}
      <Switch>
        <Route path="/characters" component={Characters} />
        <Route path="/login" exact component={Login} />
        <Route path="/register" exact component={Register} />
      </Switch>
    </div>
  );
}

export default App;
