import React, { Dispatch, SetStateAction } from 'react';

export interface ILayoutContext {
  drawerWidth: number;
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
}

const LayoutContext = React.createContext<ILayoutContext | null>(null);

export const LayoutProvider = LayoutContext.Provider;
export const LayoutConsumer = LayoutContext.Consumer;

export default LayoutContext;
