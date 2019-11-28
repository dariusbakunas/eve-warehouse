/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProcessingLogFilter, ProcessingCategory, ProcessingStatus } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetProcessingLogs
// ====================================================

export interface GetProcessingLogs_processingLogs_character {
  __typename: "Character";
  name: string;
}

export interface GetProcessingLogs_processingLogs {
  __typename: "ProcessingLogEntry";
  id: string;
  createdAt: any;
  category: ProcessingCategory;
  character: GetProcessingLogs_processingLogs_character | null;
  message: string;
  error: string | null;
  status: ProcessingStatus;
}

export interface GetProcessingLogs {
  processingLogs: GetProcessingLogs_processingLogs[];
}

export interface GetProcessingLogsVariables {
  filter?: ProcessingLogFilter | null;
}
