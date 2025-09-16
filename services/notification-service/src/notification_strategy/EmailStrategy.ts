import type { INotification } from "./INotification.ts";
import type { NotificationSchemaType } from "../schema/notification.schema.ts";
import { createNotificationController } from "../controller/notification_controller.ts";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SENDER_MAIL,
        pass: process.env.SENDER_MAIL_PASSWORD
    }
});

export class EmailStrategy implements INotification {
    async sendNotification(payload: NotificationSchemaType): Promise<void> {
        const mailOptions = {
            from: process.env.SENDER_MAIL,
            to: payload.recipient,
            subject: payload.subject,
            text: payload.body
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`Email sent to ${payload.recipient} with subject: ${payload.subject}`);
            await createNotificationController(payload, "email");
        } catch (error) {
            console.error(`Error sending email: ${error}`);
        }
    }
}