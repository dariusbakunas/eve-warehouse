import { INotificationOptions } from ".";
import { Maybe } from "../../utilityTypes";
import React from "react";

export interface INotificationContext {
  enqueueNotification: (title: string, message: Maybe<string>, options?: INotificationOptions) => string;
  closeNotification: (key?: string) => void;
}

// @ts-ignore
export const NotificationContext = React.createContext<INotificationContext>();
