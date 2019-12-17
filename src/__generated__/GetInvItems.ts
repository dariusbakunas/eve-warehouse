/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { InvItemFilter } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetInvItems
// ====================================================

export interface GetInvItems_invItems_invGroup {
  __typename: "InvGroup";
  name: string;
}

export interface GetInvItems_invItems {
  __typename: "InvItem";
  id: string;
  name: string;
  invGroup: GetInvItems_invItems_invGroup;
}

export interface GetInvItems {
  invItems: GetInvItems_invItems[];
}

export interface GetInvItemsVariables {
  filter?: InvItemFilter | null;
}
