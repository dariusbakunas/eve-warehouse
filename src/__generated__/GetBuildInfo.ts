/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetBuildInfo
// ====================================================

export interface GetBuildInfo_buildInfo_materials_item {
  __typename: "InvItem";
  id: string;
  name: string;
}

export interface GetBuildInfo_buildInfo_materials {
  __typename: "BuildMaterial";
  item: GetBuildInfo_buildInfo_materials_item;
  quantity: number;
  time: number;
}

export interface GetBuildInfo_buildInfo {
  __typename: "BuildInfo";
  materials: GetBuildInfo_buildInfo_materials[];
}

export interface GetBuildInfo {
  buildInfo: GetBuildInfo_buildInfo | null;
}

export interface GetBuildInfoVariables {
  id: string;
}
