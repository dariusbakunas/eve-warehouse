import { AuthActionTypes, IAuthState, SET_USER } from '../types';

const initialState: IAuthState = {
  user: null,
};

export const authReducer = (state = initialState, action: AuthActionTypes): IAuthState => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.payload ? { ...action.payload } : null,
      };
    default:
      return state;
  }
};
