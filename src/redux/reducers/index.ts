import { appConfigReducer } from "./appConfig";
import { combineReducers } from "redux";

export const rootReducer = combineReducers({
  appConfig: appConfigReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
