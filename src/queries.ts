import { gql } from "apollo-boost";

export const testQuery = gql`
  {
    currentUser {
      email
    }
  }
`;
