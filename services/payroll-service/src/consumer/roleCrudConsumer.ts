import { eventConsumer } from "./eventConsumer.js";
import { COMPANY_EXCHANGE, ROLE_QUEUE_NAME, ROLE_ROUTING_KEY } from "../constants.js";

export const roleConsumer = async () => {
    try {
        await eventConsumer(COMPANY_EXCHANGE, ROLE_QUEUE_NAME, ROLE_ROUTING_KEY);
    } catch (error) {
        return { message: "Channel assertion failed" };
    }
}