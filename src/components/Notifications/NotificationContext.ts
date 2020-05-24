import { INotificationOptions } from ".";
import React from "react";

export interface INotificationContext {
  enqueueNotification: (message: string, options?: INotificationOptions) => string;
  closeNotification: (key?: string) => void;
}

// @ts-ignore
export const NotificationContext = React.createContext<INotificationContext>();
