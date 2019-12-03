/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCharacterSkillGroups
// ====================================================

export interface GetCharacterSkillGroups_character_skillGroups {
  __typename: "SkillGroup";
  id: string;
  name: string;
  totalSp: number | null;
  trainedSp: number | null;
}

export interface GetCharacterSkillGroups_character {
  __typename: "Character";
  id: string;
  skillGroups: GetCharacterSkillGroups_character_skillGroups[];
}

export interface GetCharacterSkillGroups {
  character: GetCharacterSkillGroups_character | null;
}

export interface GetCharacterSkillGroupsVariables {
  id: string;
}
