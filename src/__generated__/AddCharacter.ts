/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { CharacterInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: AddCharacter
// ====================================================

export interface AddCharacter_addCharacter_corporation_alliance {
  __typename: "Alliance";
  id: string;
  name: string;
  ticker: string;
}

export interface AddCharacter_addCharacter_corporation {
  __typename: "Corporation";
  id: string;
  name: string;
  ticker: string;
  alliance: AddCharacter_addCharacter_corporation_alliance | null;
}

export interface AddCharacter_addCharacter {
  __typename: "Character";
  id: string;
  birthday: any;
  corporation: AddCharacter_addCharacter_corporation;
  name: string;
  scopes: string[] | null;
  securityStatus: number;
}

export interface AddCharacter {
  addCharacter: AddCharacter_addCharacter;
}

export interface AddCharacterVariables {
  input: CharacterInput;
}
