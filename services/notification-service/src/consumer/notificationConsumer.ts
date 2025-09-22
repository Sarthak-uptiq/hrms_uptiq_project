import { bindQueue } from "./bindQueue.js";
import { consumeEvent } from "./consumeEvent.js";
import { connectRabbitMQ, getChannel, EXCHANGE_NAME } from "./connectMQ.js";
import { NotificationManager } from "../notification_strategy/NotificationManager.js";

const QUEUE_NAME = "notification_queue";

export const notificationConsumer = async () => {
    try {   
        await connectRabbitMQ();
        const channel = getChannel();

        if(!channel) {      
            throw new Error("Channel is not created");
        }

        await bindQueue(channel, QUEUE_NAME, EXCHANGE_NAME, "user.created");
        await consumeEvent(channel, QUEUE_NAME, async (msg) => {
            const eventMessage = JSON.parse(msg.content.toString());
            console.log("Event Message: ", eventMessage);

            const notificationManager = new NotificationManager();
            notificationManager.init();
            await notificationManager.consume("user.registered", eventMessage);
        });
    } catch (error) {
        throw new Error("Error in setting up RabbitMQ broker");
    }
}
