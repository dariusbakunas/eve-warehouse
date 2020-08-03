import { AppConfigActionTypes, AuthActionTypes, IAppConfigState, SET_APP_CONFIG, SET_USER } from './types';
import { IUser } from '../api/types';
import { Maybe } from '../utilityTypes';

export const setAppConfig = (config: Partial<IAppConfigState>): AppConfigActionTypes => {
  return {
    type: SET_APP_CONFIG,
    payload: config,
  };
};

export const setUser = (user: Maybe<IUser>): AuthActionTypes => {
  return {
    type: SET_USER,
    payload: user,
  };
};
