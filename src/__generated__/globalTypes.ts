/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum MarketOrderOrderBy {
  issued = "issued",
}

export enum Order {
  asc = "asc",
  desc = "desc",
}

export enum OrderState {
  active = "active",
  cancelled = "cancelled",
  expired = "expired",
}

export enum OrderType {
  buy = "buy",
  sell = "sell",
}

export enum ProcessingCategory {
  ASSETS = "ASSETS",
  BLUEPRINTS = "BLUEPRINTS",
  BOOKMARKS = "BOOKMARKS",
  CALENDAR = "CALENDAR",
  CLONES = "CLONES",
  CONTACTS = "CONTACTS",
  IMPLANTS = "IMPLANTS",
  INDUSTRY_JOBS = "INDUSTRY_JOBS",
  MARKET_ORDERS = "MARKET_ORDERS",
  STATS = "STATS",
  WALLET_JOURNAL = "WALLET_JOURNAL",
  WALLET_TRANSACTIONS = "WALLET_TRANSACTIONS",
}

export enum ProcessingStatus {
  FAILURE = "FAILURE",
  SUCCESS = "SUCCESS",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum WalletJournalOrderBy {
  amount = "amount",
  balance = "balance",
  character = "character",
  date = "date",
  description = "description",
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

export interface MarketOrderFilter {
  characterId?: string | null;
  state?: OrderStateFilter | null;
}

export interface MarketOrderOrderByInput {
  column: MarketOrderOrderBy;
  order: Order;
}

export interface OrderStateFilter {
  active?: boolean | null;
  expired?: boolean | null;
  cancelled?: boolean | null;
}

export interface PageInput {
  index?: number | null;
  size?: number | null;
}

export interface ProcessingLogFilter {
  characterId?: string | null;
}

export interface RegistrationInput {
  firstName?: string | null;
  lastName?: string | null;
  username: string;
  email: string;
  code: string;
}

export interface WalletJournalFilter {
  characterId?: string | null;
}

export interface WalletJournalOrderByInput {
  column: WalletJournalOrderBy;
  order: Order;
}

export interface WalletTransactionFilter {
  item?: string | null;
  characterId?: string | null;
  orderType?: OrderType | null;
}

export interface WalletTransactionOrderByInput {
  column: WalletTransactionOrderBy;
  order: Order;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
