/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PageInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetTransactions
// ====================================================

export interface GetTransactions_walletTransactions_transactions_client {
  __typename: "Client";
  name: string;
}

export interface GetTransactions_walletTransactions_transactions_item {
  __typename: "InventoryItem";
  name: string | null;
}

export interface GetTransactions_walletTransactions_transactions_location {
  __typename: "Location";
  name: string;
}

export interface GetTransactions_walletTransactions_transactions {
  __typename: "WalletTransaction";
  id: string;
  date: any;
  isBuy: boolean;
  client: GetTransactions_walletTransactions_transactions_client;
  item: GetTransactions_walletTransactions_transactions_item | null;
  location: GetTransactions_walletTransactions_transactions_location;
  unitPrice: number;
  quantity: number;
}

export interface GetTransactions_walletTransactions {
  __typename: "WalletTransactions";
  total: number;
  transactions: GetTransactions_walletTransactions_transactions[];
}

export interface GetTransactions {
  walletTransactions: GetTransactions_walletTransactions | null;
}

export interface GetTransactionsVariables {
  page?: PageInput | null;
}
