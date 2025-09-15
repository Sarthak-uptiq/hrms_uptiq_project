import type { Channel } from "amqplib";
import { tr } from "zod/locales";

export const bindQueue = async (channel: Channel, queueName: string, exchangeName: string, routingKey: string) => {
    try{
        await channel.assertQueue(queueName, { durable: true });
        await channel.bindQueue(queueName, exchangeName, routingKey);
        console.log(`Queue ${queueName} bound to exchange ${exchangeName} with routing key ${routingKey}`);
    } catch(error){
        throw new Error("Error in binding queue to exchange");
    }
}