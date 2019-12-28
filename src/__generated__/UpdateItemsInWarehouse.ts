/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { WarehouseItemInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateItemsInWarehouse
// ====================================================

export interface UpdateItemsInWarehouse_updateItemsInWarehouse_item {
  __typename: "InvItem";
  id: string;
}

export interface UpdateItemsInWarehouse_updateItemsInWarehouse {
  __typename: "WarehouseItem";
  item: UpdateItemsInWarehouse_updateItemsInWarehouse_item;
  quantity: number;
  unitCost: number;
}

export interface UpdateItemsInWarehouse {
  updateItemsInWarehouse: UpdateItemsInWarehouse_updateItemsInWarehouse[];
}

export interface UpdateItemsInWarehouseVariables {
  id: string;
  input: WarehouseItemInput[];
}
