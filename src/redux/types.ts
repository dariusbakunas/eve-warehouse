import { IUser } from "../api/types";
import { Maybe } from "../utilityTypes";

export const SET_APP_CONFIG = "SET_APP_CONFIG";
export const SET_USER = "SET_USER";

export interface IAppConfigState {
  eveApiHost: string;
  eveLoginUrl: string;
  eveClientId: string;
  eveCharacterRedirectUrl: string;
}

export interface IAuthState {
  user?: Maybe<IUser>;
}

export interface ISetAppConfigAction {
  type: typeof SET_APP_CONFIG;
  payload: Partial<IAppConfigState>;
}

export interface ISetUserAction {
  type: typeof SET_USER;
  payload: Maybe<IUser>;
}

export type AppConfigActionTypes = ISetAppConfigAction;
export type AuthActionTypes = ISetUserAction;
