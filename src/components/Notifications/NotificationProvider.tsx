import { createPortal } from "react-dom";
import { DeepRequired } from "ts-essentials";
import { INotification, INotificationOptions, INotificationOrigin } from ".";
import { NotificationContainer } from "./NotificationContainer";
import { NotificationContext } from "./NotificationContext";
import { ToastNotification } from "carbon-components-react";
import React, { useCallback, useMemo, useState } from "react";

const DEFAULTS: DeepRequired<INotificationOptions> = {
  kind: "info",
  origin: {
    vertical: "top",
    horizontal: "right",
  },
};

interface INotificationProvider {
  root?: HTMLElement;
}

const getOriginKey = (origin: INotificationOrigin) => {
  return `${origin.vertical}_${origin.horizontal}`;
};

export const NotificationProvider: React.FC<INotificationProvider> = ({ children, root }) => {
  const [notifications, setNotifications] = useState<INotification[]>([]);

  const enqueueNotification = useCallback((message: string, options?: INotificationOptions) => {
    const id = new Date().getTime() + Math.random();

    const notification: INotification = {
      id,
      message,
      options: Object.assign({}, DEFAULTS, options),
    };

    setNotifications((prevNotifications) => {
      return [...prevNotifications, notification];
    });
  }, []);

  const closeNotification = useCallback((key: string) => {
    console.log(key);
  }, []);

  const notificationsByOrigin = useMemo(() => {
    return notifications.reduce<{ [key: string]: INotification[] }>((acc, notification) => {
      const originKey = getOriginKey(notification.options.origin);
      acc[originKey] = acc[originKey] || [];
      acc[originKey].push(notification);
      return acc;
    }, {});
  }, [notifications]);

  const handleRemoveNotification = useCallback(
    (key: number) => {
      setNotifications((prevNotifications) => {
        return prevNotifications.filter((notification) => notification.id !== key);
      });
    },
    [notifications]
  );

  const notificationContainer = Object.entries(notificationsByOrigin).map(([origin, notifications]) => (
    <NotificationContainer key={origin} origin={notifications[0].options.origin}>
      {notifications.map((notification) => (
        <ToastNotification
          onCloseButtonClick={() => handleRemoveNotification(notification.id)}
          timeout={5000}
          key={notification.id}
          kind={notification.options.kind}
          hideCloseButton={false}
          notificationType="toast"
          role="alert"
          caption={notification.message}
          subtitle="Subtitle"
          title="Title"
        />
      ))}
    </NotificationContainer>
  ));

  return (
    <NotificationContext.Provider value={{ enqueueNotification, closeNotification }}>
      {children}
      {root ? createPortal(notificationContainer, root) : notificationContainer}
    </NotificationContext.Provider>
  );
};
