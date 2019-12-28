/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { WarehouseItemInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: AddItemsToWarehouse
// ====================================================

export interface AddItemsToWarehouse_addItemsToWarehouse_item {
  __typename: "InvItem";
  id: string;
}

export interface AddItemsToWarehouse_addItemsToWarehouse {
  __typename: "WarehouseItem";
  item: AddItemsToWarehouse_addItemsToWarehouse_item;
  quantity: number;
  unitCost: number;
}

export interface AddItemsToWarehouse {
  addItemsToWarehouse: AddItemsToWarehouse_addItemsToWarehouse[];
}

export interface AddItemsToWarehouseVariables {
  id: string;
  input: WarehouseItemInput[];
}
