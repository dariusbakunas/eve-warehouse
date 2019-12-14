/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTransactionSummary
// ====================================================

export interface GetTransactionSummary_walletTransactionSummary_items {
  __typename: "WalletTransactionSummaryItem";
  id: string;
  credit: number;
  quantity: number;
  name: string;
}

export interface GetTransactionSummary_walletTransactionSummary {
  __typename: "WalletTransactionSummary";
  items: GetTransactionSummary_walletTransactionSummary_items[];
}

export interface GetTransactionSummary {
  walletTransactionSummary: GetTransactionSummary_walletTransactionSummary;
}

export interface GetTransactionSummaryVariables {
  ids: string[];
}
