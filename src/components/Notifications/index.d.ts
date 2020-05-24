import { DeepRequired } from "ts-essentials";

export type INotificationKind = "error" | "info" | "success" | "warning";

export interface INotificationOrigin {
  vertical: "top" | "bottom";
  horizontal: "left" | "center" | "right";
}

export interface INotificationOptions {
  origin?: INotificationOrigin;
  kind?: INotificationKind;
}

export interface INotification {
  id: number;
  message: string;
  options: DeepRequired<INotificationOptions>;
}
