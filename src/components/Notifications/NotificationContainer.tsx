import { INotificationOrigin } from ".";
import clsx from "clsx";
import React from "react";

interface INotificationContainer {
  origin: INotificationOrigin;
}

export const NotificationContainer: React.FC<INotificationContainer> = ({ children, origin }) => {
  const classes = clsx("notification-container", origin.vertical, origin.horizontal);
  return <div className={classes}>{children}</div>;
};
