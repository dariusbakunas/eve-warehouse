import React, { createContext, Dispatch, ReducerAction, useReducer } from 'react';

type ApplicationState = { [key: string]: string };

interface IAction {
  type: 'setValue';
  key: string;
  value: string;
}

const initialState: ApplicationState = {};

interface IContext {
  state: ApplicationState;
  dispatch: Dispatch<ReducerAction<React.Reducer<ApplicationState, IAction>>>;
}

const ApplicationContext = createContext<IContext>({ state: initialState, dispatch: () => {} });
const { Provider } = ApplicationContext;

const reducer: React.Reducer<ApplicationState, IAction> = (state, action) => {
  switch (action.type) {
    case 'setValue': {
      return {
        ...state,
        [action.key]: action.value,
      };
    }
    default:
      throw new Error();
  }
};

const ApplicationStateProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { ApplicationContext, ApplicationStateProvider };
