export const SET_APP_CONFIG = "SET_APP_CONFIG";

export interface IAppConfigState {
  eveApiHost: string;
  eveLoginUrl: string;
  eveClientId: string;
  eveCharacterRedirectUrl: string;
}

export interface ISetAppConfigAction {
  type: typeof SET_APP_CONFIG;
  payload: Partial<IAppConfigState>;
}

export type AppConfigActionTypes = ISetAppConfigAction;
