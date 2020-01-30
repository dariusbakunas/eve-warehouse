/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetWarehouseItems
// ====================================================

export interface GetWarehouseItems_warehouse_summary {
  __typename: "WarehouseSummary";
  totalCost: number;
  totalVolume: number;
}

export interface GetWarehouseItems_warehouse_items_item_jitaPrice {
  __typename: "ItemMarketPrice";
  buy: number | null;
  sell: number | null;
}

export interface GetWarehouseItems_warehouse_items_item {
  __typename: "InvItem";
  id: string;
  name: string;
  jitaPrice: GetWarehouseItems_warehouse_items_item_jitaPrice | null;
  volume: number;
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
  summary: GetWarehouseItems_warehouse_summary;
  items: GetWarehouseItems_warehouse_items[];
}

export interface GetWarehouseItems {
  warehouse: GetWarehouseItems_warehouse | null;
}

export interface GetWarehouseItemsVariables {
  id: string;
}
