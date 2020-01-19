import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { withRouter } from 'next/router';
import { WithRouterProps } from 'next/dist/client/with-router';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: 'url(public/background.jpg) no-repeat center center fixed',
      '-webkit-background-size': 'cover',
    },
  })
);

const Login: React.FC<WithRouterProps> = ({ router }) => {
  const classes = useStyles();

  const handleLoginClick = () => {
    router.push({
      pathname: '/auth/login',
    });
  };

  return (
    <Grid container spacing={0} direction="column" alignItems="center" justify="center" style={{ minHeight: '100vh' }} className={classes.root}>
      <Grid item xs={3}>
        <Button variant="contained" color="primary" onClick={handleLoginClick}>
          LOGIN
        </Button>
      </Grid>
    </Grid>
  );
};

export default withRouter(Login);
