import type { Channel } from "amqplib";

export const consumeEvent = async (channel: Channel, queueName: string, onMessage: (msg: any) => void) => {
    try {
        channel.consume(queueName, (msg) => {
            if (msg) {
                console.log("Recieved event", JSON.parse(msg.content.toString()));
                channel.ack(msg);
                onMessage(msg);
            }
        });
    } catch (error) {
        throw new Error("Error in consuming event");
    }
};