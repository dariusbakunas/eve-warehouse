import { createStore } from "redux";
import { devToolsEnhancer } from "redux-devtools-extension/logOnlyInProduction";
import { rootReducer } from "./reducers";

export const store = createStore(rootReducer, devToolsEnhancer({}));
