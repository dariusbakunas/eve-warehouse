/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCharacterSkills
// ====================================================

export interface GetCharacterSkills_character_skillGroups {
  __typename: "SkillGroup";
  id: string;
  name: string;
  totalSp: number | null;
}

export interface GetCharacterSkills_character {
  __typename: "Character";
  id: string;
  skillGroups: GetCharacterSkills_character_skillGroups[];
}

export interface GetCharacterSkills {
  character: GetCharacterSkills_character | null;
}

export interface GetCharacterSkillsVariables {
  id: string;
}
