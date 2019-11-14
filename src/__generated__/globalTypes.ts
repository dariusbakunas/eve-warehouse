/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface CharacterInput {
  code: string;
}

export interface PageInput {
  index?: number | null;
  size?: number | null;
}

export interface RegistrationInput {
  firstName?: string | null;
  lastName?: string | null;
  username: string;
  email: string;
  code: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
