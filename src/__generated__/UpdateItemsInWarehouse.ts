/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { WarehouseItemInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateItemsInWarehouse
// ====================================================

export interface UpdateItemsInWarehouse_updateItemsInWarehouse {
  __typename: "WarehouseItem";
  id: string;
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
