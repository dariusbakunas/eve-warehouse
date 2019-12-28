/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CheckWarehouseItems
// ====================================================

export interface CheckWarehouseItems_warehouseItems_warehouse {
  __typename: "Warehouse";
  id: string;
  name: string;
}

export interface CheckWarehouseItems_warehouseItems_item {
  __typename: "InvItem";
  id: string;
}

export interface CheckWarehouseItems_warehouseItems {
  __typename: "WarehouseItem";
  warehouse: CheckWarehouseItems_warehouseItems_warehouse;
  item: CheckWarehouseItems_warehouseItems_item;
  quantity: number;
  unitCost: number;
}

export interface CheckWarehouseItems {
  warehouseItems: CheckWarehouseItems_warehouseItems[] | null;
}

export interface CheckWarehouseItemsVariables {
  itemIds: string[];
  warehouseIds?: string[] | null;
}
