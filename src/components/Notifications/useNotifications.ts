import { INotificationContext, NotificationContext } from './NotificationContext';
import { useContext } from 'react';

export const useNotification = () => useContext<INotificationContext>(NotificationContext);
