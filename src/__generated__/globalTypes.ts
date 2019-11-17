/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum Order {
  asc = "asc",
  desc = "desc",
}

export enum OrderType {
  buy = "buy",
  sell = "sell",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum WalletTransactionOrderBy {
  character = "character",
  client = "client",
  credit = "credit",
  date = "date",
  item = "item",
  quantity = "quantity",
  station = "station",
  unitPrice = "unitPrice",
}

export interface PageInput {
  index?: number | null;
  size?: number | null;
}

export interface RegistrationInput {
  firstName?: string | null;
  lastName?: string | null;
  username: string;
  email: string;
  code: string;
}

export interface WalletTransactionFilter {
  orderType?: OrderType | null;
}

export interface WalletTransactionOrderByInput {
  column: WalletTransactionOrderBy;
  order: Order;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
