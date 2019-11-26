/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PageInput, MarketOrderFilter, MarketOrderOrderByInput, OrderState } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetMarketOrders
// ====================================================

export interface GetMarketOrders_marketOrders_orders_item {
  __typename: "InventoryItem";
  name: string | null;
}

export interface GetMarketOrders_marketOrders_orders_character {
  __typename: "Character";
  name: string;
}

export interface GetMarketOrders_marketOrders_orders {
  __typename: "MarketOrder";
  id: string;
  /**
   * Number of days for which order is valid (starting from the issued date). An order expires at time issued + duration
   */
  duration: number;
  /**
   * Item transacted in this order
   */
  item: GetMarketOrders_marketOrders_orders_item;
  /**
   * Date and time when this order was issued
   */
  issued: any;
  /**
   * Character who issued the order
   */
  character: GetMarketOrders_marketOrders_orders_character;
  /**
   * For buy orders, the amount of ISK in escrow
   */
  escrow: number | null;
  /**
   * True if this is buy order
   */
  isBuy: boolean;
  /**
   * Cost per unit for this order
   */
  price: number;
  /**
   * Current order state
   */
  state: OrderState;
  /**
   * For buy orders, the minimum quantity that will be accepted in a matching sell order
   */
  minVolume: number | null;
  /**
   * Quantity of items still required or offered
   */
  volumeRemain: number;
  /**
   * Quantity of items required or offered at time order was placed
   */
  volumeTotal: number;
}

export interface GetMarketOrders_marketOrders {
  __typename: "MarketOrders";
  total: number;
  orders: GetMarketOrders_marketOrders_orders[];
}

export interface GetMarketOrders {
  marketOrders: GetMarketOrders_marketOrders;
}

export interface GetMarketOrdersVariables {
  page?: PageInput | null;
  filter?: MarketOrderFilter | null;
  orderBy?: MarketOrderOrderByInput | null;
}
