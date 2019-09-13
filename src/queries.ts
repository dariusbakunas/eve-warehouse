import { gql } from "apollo-boost";

export const testQuery = gql`
  {
    scopes {
      id
      name
    }
  }
`;
