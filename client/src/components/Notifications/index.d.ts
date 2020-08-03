import { DeepRequired } from 'ts-essentials';

export type INotificationKind = 'error' | 'info' | 'success' | 'warning';

export interface INotificationOrigin {
  vertical: 'top' | 'bottom';
  horizontal: 'left' | 'center' | 'right';
}

export interface INotificationOptions {
  origin?: INotificationOrigin;
  kind?: INotificationKind;
  timeout?: number;
}

export interface INotification {
  id: number;
  caption: string;
  title: string;
  message?: string | null;
  options: DeepRequired<INotificationOptions>;
}
