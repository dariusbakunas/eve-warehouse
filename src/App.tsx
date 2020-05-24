import { Characters } from "./pages/Characters";
import { getCurrentUser } from "./api";
import { Header, HeaderGlobalAction, HeaderGlobalBar, HeaderName } from "carbon-components-react";
import { IUser } from "./api/types";
import { Login } from "./pages/Login";
import { Logout20 } from "@carbon/icons-react";
import { Redirect, Route, Switch } from "react-router-dom";
import React, { useCallback, useEffect, useState } from "react";

const DEV = process.env.NODE_ENV === "development";

function App() {
  const [user, setUser] = useState<IUser>();
  const [error, setError] = useState<Error>();

  const logout = useCallback(() => {
    window.location.href = DEV ? "http://localhost:3001/auth/logout" : "/auth/logout";
  }, []);

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await getCurrentUser();
        setUser(user);
      } catch (e) {
        setError(e);
      }
    };

    getUser();
  }, []);

  return (
    <div className="App">
      {user && (
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
      <Switch>
        <Route path="/characters" component={Characters} />
        <Route path="/login" exact component={Login} />
      </Switch>
    </div>
  );
}

export default App;
