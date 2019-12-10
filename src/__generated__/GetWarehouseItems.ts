/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetWarehouseItems
// ====================================================

export interface GetWarehouseItems_warehouse_items {
  __typename: "WarehouseItem";
  id: string;
  name: string;
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
