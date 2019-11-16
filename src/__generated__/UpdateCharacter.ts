/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateCharacter
// ====================================================

export interface UpdateCharacter_updateCharacter_corporation_alliance {
  __typename: "Alliance";
  id: string;
  name: string;
  ticker: string;
}

export interface UpdateCharacter_updateCharacter_corporation {
  __typename: "Corporation";
  id: string;
  name: string;
  ticker: string;
  alliance: UpdateCharacter_updateCharacter_corporation_alliance | null;
}

export interface UpdateCharacter_updateCharacter {
  __typename: "Character";
  id: string;
  birthday: any;
  corporation: UpdateCharacter_updateCharacter_corporation;
  name: string;
  scopes: string[] | null;
  securityStatus: number;
  totalSp: number | null;
}

export interface UpdateCharacter {
  updateCharacter: UpdateCharacter_updateCharacter;
}

export interface UpdateCharacterVariables {
  id: string;
  code: string;
}
