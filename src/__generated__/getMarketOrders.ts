/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PageInput, CharacterMarketOrderFilter, CharacterMarketOrderOrderByInput, OrderState } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetMarketOrders
// ====================================================

export interface GetMarketOrders_characterMarketOrders_orders_item {
  __typename: "InvItem";
  id: string;
  name: string;
}

export interface GetMarketOrders_characterMarketOrders_orders_character {
  __typename: "Character";
  name: string;
}

export interface GetMarketOrders_characterMarketOrders_orders_location {
  __typename: "Location";
  name: string;
}

export interface GetMarketOrders_characterMarketOrders_orders {
  __typename: "CharacterMarketOrder";
  id: string;
  /**
   * Number of days for which order is valid (starting from the issued date). An order expires at time issued + duration
   */
  duration: number;
  /**
   * Item transacted in this order
   */
  item: GetMarketOrders_characterMarketOrders_orders_item;
  /**
   * Date and time when this order was issued
   */
  issued: any;
  /**
   * Character who issued the order
   */
  character: GetMarketOrders_characterMarketOrders_orders_character;
  /**
   * Location where order was placed
   */
  location: GetMarketOrders_characterMarketOrders_orders_location;
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

export interface GetMarketOrders_characterMarketOrders {
  __typename: "CharacterMarketOrders";
  total: number;
  orders: GetMarketOrders_characterMarketOrders_orders[];
}

export interface GetMarketOrders {
  characterMarketOrders: GetMarketOrders_characterMarketOrders;
}

export interface GetMarketOrdersVariables {
  page?: PageInput | null;
  filter?: CharacterMarketOrderFilter | null;
  orderBy?: CharacterMarketOrderOrderByInput | null;
}
