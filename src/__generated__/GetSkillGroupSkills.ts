/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSkillGroupSkills
// ====================================================

export interface GetSkillGroupSkills_character_skillGroup_skills {
  __typename: "Skill";
  id: string;
  name: string;
  multiplier: number | null;
  activeSkillLevel: number | null;
  trainedSkillLevel: number | null;
  skillPointsInSkill: number | null;
}

export interface GetSkillGroupSkills_character_skillGroup {
  __typename: "SkillGroup";
  skills: GetSkillGroupSkills_character_skillGroup_skills[];
}

export interface GetSkillGroupSkills_character {
  __typename: "Character";
  skillGroup: GetSkillGroupSkills_character_skillGroup | null;
}

export interface GetSkillGroupSkills {
  character: GetSkillGroupSkills_character | null;
}

export interface GetSkillGroupSkillsVariables {
  characterId: string;
  skillGroupId: string;
}
