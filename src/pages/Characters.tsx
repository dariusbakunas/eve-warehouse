import React from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import withApollo from "../lib/withApollo";

export const GET_CURRENT_USER = gql`
  {
    currentUser {
      name
    }
  }
`;

export const Characters: React.FC = () => {
  const { loading, error, data } = useQuery(GET_CURRENT_USER);
  return <div>{ data && data.currentUser.name }</div>;
};

export default withApollo(Characters);
