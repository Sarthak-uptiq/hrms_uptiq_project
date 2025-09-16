import {z} from "zod";

export const NotificationSchema = z.object({
    subject: z.string().min(1, "Subject is required"),
    body: z.string().min(1, "Body is required"),
    recipient: z.string()
});

export type NotificationSchemaType = z.infer<typeof NotificationSchema>;