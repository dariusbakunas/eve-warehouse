import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { withRouter } from 'next/router';
import { WithRouterProps } from 'next/dist/client/with-router';

const Login: React.FC<WithRouterProps> = ({ router }) => {
  const handleLoginClick = () => {
    router.push({
      pathname: '/auth/login',
    });
  };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      style={{ minHeight: '100vh' }}
    >
      <Grid item xs={3}>
        <Button variant="contained" color="primary" onClick={handleLoginClick}>
          LOGIN
        </Button>
      </Grid>
    </Grid>
  );
};

export default withRouter(Login);
