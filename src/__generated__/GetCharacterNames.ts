/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCharacterNames
// ====================================================

export interface GetCharacterNames_characters {
  __typename: "Character";
  id: string;
  name: string;
}

export interface GetCharacterNames {
  characters: GetCharacterNames_characters[];
}
