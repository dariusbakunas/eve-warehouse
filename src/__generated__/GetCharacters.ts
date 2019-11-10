/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCharacters
// ====================================================

export interface GetCharacters_characters_corporation_alliance {
  __typename: "Alliance";
  id: string;
  name: string;
  ticker: string;
}

export interface GetCharacters_characters_corporation {
  __typename: "Corporation";
  id: string;
  name: string;
  ticker: string;
  alliance: GetCharacters_characters_corporation_alliance | null;
}

export interface GetCharacters_characters {
  __typename: "Character";
  id: string;
  birthday: any;
  corporation: GetCharacters_characters_corporation;
  name: string;
  scopes: string[] | null;
  securityStatus: number;
  totalSp: number | null;
}

export interface GetCharacters {
  characters: GetCharacters_characters[];
}
