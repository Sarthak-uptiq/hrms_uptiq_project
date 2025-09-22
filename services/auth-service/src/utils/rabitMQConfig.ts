import { bindQueue } from "./bindQueue.js";
import { consumeEvent } from "./consumeEvent.js";
import { connectRabbitMQ, getChannel, EXCHANGE_NAME } from "./connectMQ.js";
import {register} from "../controller/auth_controller.js";

const QUEUE_NAME = "auth_service_queue";


export const userConsumer = async () => {
    try {   
        await connectRabbitMQ();
        const channel = getChannel();

        if(!channel) {      
            throw new Error("Channel is not created");
        }

        await bindQueue(channel, QUEUE_NAME, EXCHANGE_NAME, "employee.created");
        await consumeEvent(channel, QUEUE_NAME, async (msg) => {
            const eventMessage = JSON.parse(msg.content.toString());
            console.log("Event Message: ", eventMessage);

            await register(eventMessage);
        });
    } catch (error) {
        throw new Error("Error in setting up RabbitMQ broker");
    }
}
