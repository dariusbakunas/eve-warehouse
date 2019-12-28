/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetWarehouseItems
// ====================================================

export interface GetWarehouseItems_warehouse_items_item {
  __typename: "InvItem";
  id: string;
  name: string;
}

export interface GetWarehouseItems_warehouse_items {
  __typename: "WarehouseItem";
  item: GetWarehouseItems_warehouse_items_item;
  quantity: number;
  unitCost: number;
}

export interface GetWarehouseItems_warehouse {
  __typename: "Warehouse";
  id: string;
  items: GetWarehouseItems_warehouse_items[];
}

export interface GetWarehouseItems {
  warehouse: GetWarehouseItems_warehouse | null;
}

export interface GetWarehouseItemsVariables {
  id: string;
}
