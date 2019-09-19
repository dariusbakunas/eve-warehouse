import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Router from "next/router";

const Login = () => {
  const handleLoginClick = () => {
    Router.push({
      pathname: "/auth/login"
    });
  };

  return (
    <Grid container spacing={0} direction="column" alignItems="center" justify="center" style={{ minHeight: "100vh" }}>
      <Grid item xs={3}>
        <Button variant="contained" color="primary" onClick={handleLoginClick}>
          LOGIN
        </Button>
      </Grid>
    </Grid>
  );
};

export default Login;
