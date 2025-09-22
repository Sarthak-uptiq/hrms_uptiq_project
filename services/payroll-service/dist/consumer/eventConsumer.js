import { assertExchange } from "./assertExchange.js";
import { bindQueue } from "./bindQueue.js";
import { getChannel } from "./connectMQ.js";
import { consumeEvent } from "./consumeEvent.js";
import { EventManager } from "../PayrollEventManager/EventManager.js";
export const eventConsumer = async (EXCHANGE_NAME, QUEUE_NAME, ROUTING_KEY) => {
    try {
        const channel = getChannel();
        if (!channel) {
            throw new Error("Channel assertion failed");
        }
        await assertExchange(EXCHANGE_NAME);
        await bindQueue(channel, QUEUE_NAME, EXCHANGE_NAME, ROUTING_KEY);
        await consumeEvent(channel, QUEUE_NAME, async (msg) => {
            const eventType = msg.fields.routingKey;
            const eventMessage = JSON.parse(msg.content.toString());
            console.log("Message recieved: ", eventMessage);
            const eventManager = new EventManager();
            eventManager.init();
            await eventManager.consume(eventType, eventMessage);
        });
    }
    catch (error) {
        console.log(error);
        return { message: "Channel assertion failed" };
    }
};
