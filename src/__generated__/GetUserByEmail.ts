/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { UserStatus } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetUserByEmail
// ====================================================

export interface GetUserByEmail_userByEmail {
  __typename: "User";
  id: string;
  email: string;
  username: string;
  status: UserStatus;
}

export interface GetUserByEmail {
  userByEmail: GetUserByEmail_userByEmail | null;
}

export interface GetUserByEmailVariables {
  email: string;
}
