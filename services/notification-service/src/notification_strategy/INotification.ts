import type { NotificationSchemaType } from "../schema/notification.schema.ts";

export interface INotification {
    sendNotification(payload: NotificationSchemaType): Promise<void>;
}