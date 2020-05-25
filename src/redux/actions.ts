import { AppConfigActionTypes, IAppConfigState, SET_APP_CONFIG } from "./types";

export const setAppConfig = (config: Partial<IAppConfigState>): AppConfigActionTypes => {
  return {
    type: SET_APP_CONFIG,
    payload: config,
  };
};
