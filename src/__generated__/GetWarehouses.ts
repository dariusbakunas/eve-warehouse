/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetWarehouses
// ====================================================

export interface GetWarehouses_warehouses_summary {
  __typename: "WarehouseSummary";
  totalCost: number;
  totalVolume: number;
}

export interface GetWarehouses_warehouses {
  __typename: "Warehouse";
  id: string;
  name: string;
  summary: GetWarehouses_warehouses_summary;
}

export interface GetWarehouses {
  warehouses: GetWarehouses_warehouses[];
}
