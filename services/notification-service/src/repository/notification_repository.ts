import { PrismaClient} from "@prisma/client";
import type { NotificationSchemaType } from "../schema/notification.schema.js";

const prisma = new PrismaClient();

export const createNotification = async (notification: NotificationSchemaType, type_id: number) => {
    return prisma.notification.create({
        data: {
            subject: notification.subject,
            body: notification.body,
            recipient: notification.recipient,
            notification_type_id: type_id,
        }
    });
}


export const getNotificationType = async (type: string) => {
    return prisma.notification_type.findUnique({
        where: { type_name: type },
    });
}