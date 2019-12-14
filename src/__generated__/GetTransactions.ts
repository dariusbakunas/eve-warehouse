/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PageInput, WalletTransactionFilter, WalletTransactionOrderByInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetTransactions
// ====================================================

export interface GetTransactions_walletTransactions_transactions_character {
  __typename: "Character";
  name: string;
}

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
  character: GetTransactions_walletTransactions_transactions_character;
  credit: number;
  client: GetTransactions_walletTransactions_transactions_client;
  item: GetTransactions_walletTransactions_transactions_item;
  location: GetTransactions_walletTransactions_transactions_location;
  unitPrice: number;
  quantity: number;
}

export interface GetTransactions_walletTransactions {
  __typename: "WalletTransactions";
  total: number;
  lastUpdate: any | null;
  transactions: GetTransactions_walletTransactions_transactions[];
}

export interface GetTransactions {
  walletTransactions: GetTransactions_walletTransactions;
}

export interface GetTransactionsVariables {
  page?: PageInput | null;
  filter?: WalletTransactionFilter | null;
  orderBy?: WalletTransactionOrderByInput | null;
}
