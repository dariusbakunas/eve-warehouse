/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCharacterSkillQueue
// ====================================================

export interface GetCharacterSkillQueue_character_skillQueue_skill {
  __typename: "Skill";
  id: string;
  name: string;
  trainedSkillLevel: number | null;
}

export interface GetCharacterSkillQueue_character_skillQueue {
  __typename: "SkillQueueItem";
  skill: GetCharacterSkillQueue_character_skillQueue_skill | null;
  finishDate: any | null;
  finishedLevel: number;
  position: number;
  startDate: any | null;
  levelStartSp: number;
  levelEndSp: number;
  trainingStartSp: number;
}

export interface GetCharacterSkillQueue_character {
  __typename: "Character";
  skillQueue: GetCharacterSkillQueue_character_skillQueue[];
}

export interface GetCharacterSkillQueue {
  character: GetCharacterSkillQueue_character | null;
}

export interface GetCharacterSkillQueueVariables {
  id: string;
}
