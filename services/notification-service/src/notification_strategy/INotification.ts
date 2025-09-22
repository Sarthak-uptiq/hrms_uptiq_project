import type { NotificationSchemaType } from "../schema/notification.schema.js";

export interface INotification {
    sendNotification(payload: NotificationSchemaType): Promise<void>;
}