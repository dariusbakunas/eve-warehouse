/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { CharacterInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: AddCharacter
// ====================================================

export interface AddCharacter_addCharacter {
  __typename: "Character";
  id: string;
}

export interface AddCharacter {
  addCharacter: AddCharacter_addCharacter;
}

export interface AddCharacterVariables {
  input: CharacterInput;
}
