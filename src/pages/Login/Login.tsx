import { Button } from "carbon-components-react";
import pJson from "../../../package.json";
import React, { useCallback } from "react";

const DEV = process.env.NODE_ENV === "development";

export const Login: React.FC = () => {
  const handleLoginClick = useCallback(() => {
    window.location.href = DEV ? "http://localhost:3001/auth/login" : "/auth/login";
  }, []);

  return (
    <div className="login-page">
      <div>
        <h1>Eve Warehouse</h1>
        <div className="version">v{pJson.version}</div>
        <Button onClick={handleLoginClick} size="small">
          LOGIN
        </Button>
      </div>
    </div>
  );
};
