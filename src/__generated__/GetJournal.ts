/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PageInput, WalletJournalOrderByInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetJournal
// ====================================================

export interface GetJournal_walletJournal_entries_character {
  __typename: "Character";
  id: string;
  name: string;
}

export interface GetJournal_walletJournal_entries {
  __typename: "JournalEntry";
  id: string;
  amount: number;
  balance: number;
  character: GetJournal_walletJournal_entries_character | null;
  date: any;
  description: string | null;
}

export interface GetJournal_walletJournal {
  __typename: "JournalEntries";
  total: number;
  entries: GetJournal_walletJournal_entries[];
}

export interface GetJournal {
  walletJournal: GetJournal_walletJournal | null;
}

export interface GetJournalVariables {
  page?: PageInput | null;
  orderBy?: WalletJournalOrderByInput | null;
}
