import { createNotification, getNotificationType } from "../repository/notification_repository.js";
import type { NotificationSchemaType } from "../schema/notification.schema.js";


export const createNotificationController = async (payload: NotificationSchemaType, type: string) => {

    try {
        if(!payload || !payload.subject || !payload.body || !payload.recipient) {
            return { status: 400, message: "Invalid payload" };
        }

        const notificationType = await getNotificationType(type);

        if(!notificationType){
            return { status: 400, message: "Invalid notification type" };
        }

        const notification = await createNotification(payload, notificationType.id);
        console.log("Notification created:", notification);
        return { status: 201, message: "Notification created successfully", data: notification };
    } catch (error) {
        console.error("Error creating notification:", error);
        return { status: 500, message: "Internal server error" };
    }
}