import React from "react";
import Button from '@material-ui/core/Button';
import { RouteComponentProps, withRouter } from 'react-router'
import { useAuth0 } from "../react-auth0-spa";

const Profile = (props: RouteComponentProps) => {
  const { loading, user } = useAuth0();

  if (loading || !user) {
    return <div>loading</div>;
  }

  return (
    <div>
      <img
        src={user.picture}
        alt="Profile"
        className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
      />
      <h2>{user.name}</h2>
      <p className="lead text-muted">{user.email}</p>
      {JSON.stringify(user, null, 2)}
      <Button onClick={() => { props.history.push("/")}}>Home</Button>
    </div>
  );
};

export default Profile;
