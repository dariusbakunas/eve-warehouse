import React from "react";
import Button from '@material-ui/core/Button';
import { RouteComponentProps, withRouter } from 'react-router'

const Home = (props: RouteComponentProps) => {
  return (
    <div>
      <Button onClick={() => { props.history.push("/profile")}}>Profile</Button>
    </div>
  );
};

export default withRouter(Home);
