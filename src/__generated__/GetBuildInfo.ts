/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetBuildInfo
// ====================================================

export interface GetBuildInfo_buildInfo_materials_item_jitaPrice {
  __typename: "ItemMarketPrice";
  buy: number | null;
  sell: number | null;
}

export interface GetBuildInfo_buildInfo_materials_item {
  __typename: "InvItem";
  id: string;
  name: string;
  jitaPrice: GetBuildInfo_buildInfo_materials_item_jitaPrice | null;
}

export interface GetBuildInfo_buildInfo_materials {
  __typename: "BuildMaterial";
  item: GetBuildInfo_buildInfo_materials_item;
  quantity: number;
}

export interface GetBuildInfo_buildInfo {
  __typename: "BuildInfo";
  materials: GetBuildInfo_buildInfo_materials[];
  quantity: number;
  time: number;
  productionLimit: number;
}

export interface GetBuildInfo {
  buildInfo: GetBuildInfo_buildInfo | null;
}

export interface GetBuildInfoVariables {
  id: string;
}
