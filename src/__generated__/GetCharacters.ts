/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCharacters
// ====================================================

export interface GetCharacters_characters {
  __typename: "Character";
  id: string;
  name: string;
  scopes: string[] | null;
}

export interface GetCharacters {
  characters: GetCharacters_characters[];
}
