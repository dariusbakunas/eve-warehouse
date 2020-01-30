/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { WarehouseItemInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: AddItemsToWarehouse
// ====================================================

export interface AddItemsToWarehouse_addItemsToWarehouse_warehouse {
  __typename: "Warehouse";
  id: string;
}

export interface AddItemsToWarehouse_addItemsToWarehouse_item_jitaPrice {
  __typename: "ItemMarketPrice";
  buy: number | null;
  sell: number | null;
}

export interface AddItemsToWarehouse_addItemsToWarehouse_item {
  __typename: "InvItem";
  id: string;
  name: string;
  jitaPrice: AddItemsToWarehouse_addItemsToWarehouse_item_jitaPrice | null;
  volume: number;
}

export interface AddItemsToWarehouse_addItemsToWarehouse {
  __typename: "WarehouseItem";
  warehouse: AddItemsToWarehouse_addItemsToWarehouse_warehouse;
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
