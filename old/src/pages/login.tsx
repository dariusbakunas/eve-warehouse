import { Button } from 'carbon-components-react';
import { withRouter } from 'next/router';
import { WithRouterProps } from 'next/dist/client/with-router';
import React, { useCallback } from 'react';

const Login: React.FC<WithRouterProps> = ({ router }) => {
  const handleLoginClick = useCallback(() => {
    router.push({
      pathname: '/auth/login',
    });
  }, []);

  return (
    <div className="login-page">
      <h2>Eve Warehouse</h2>
      <Button onClick={handleLoginClick} size="small">
        LOGIN
      </Button>
    </div>
  );
};

export default withRouter(Login);
