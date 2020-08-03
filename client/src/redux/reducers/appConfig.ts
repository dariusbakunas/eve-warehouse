import { AppConfigActionTypes, IAppConfigState, SET_APP_CONFIG } from '../types';

const initialState: IAppConfigState = {
  eveApiHost: '',
  eveLoginUrl: '',
  eveClientId: '',
  eveCharacterRedirectUrl: '',
};

export const appConfigReducer = (state = initialState, action: AppConfigActionTypes): IAppConfigState => {
  switch (action.type) {
    case SET_APP_CONFIG:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
