/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { NewWarehouseItemInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: AddItemsToWarehouse
// ====================================================

export interface AddItemsToWarehouse_addItemsToWarehouse {
  __typename: "WarehouseItem";
  id: string;
  quantity: number;
  unitCost: number;
}

export interface AddItemsToWarehouse {
  addItemsToWarehouse: AddItemsToWarehouse_addItemsToWarehouse[];
}

export interface AddItemsToWarehouseVariables {
  id: string;
  input: NewWarehouseItemInput[];
}
