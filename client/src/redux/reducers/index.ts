import { appConfigReducer } from './appConfig';
import { authReducer } from './auth';
import { combineReducers } from 'redux';

export const rootReducer = combineReducers({
  appConfig: appConfigReducer,
  auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
