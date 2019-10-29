/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { RegistrationInput, UserStatus } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: Register
// ====================================================

export interface Register_register {
  __typename: "User";
  id: string;
  status: UserStatus;
}

export interface Register {
  register: Register_register | null;
}

export interface RegisterVariables {
  input: RegistrationInput;
}
