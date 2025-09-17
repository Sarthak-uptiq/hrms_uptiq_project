import { EXCHANGE_NAME, EXCHANGE_TYPE, PAYROLL_EXCHANGE } from "../constants.ts";
import { assertExchange, connectRabbitMQ, getChannel } from "./rabbitmq.ts";


export const boot = async () => {
    try {
        await connectRabbitMQ();
        const channel = getChannel();

        if (!channel) {
            throw new Error("Channel not created");
        }

        const [company_exchange, payroll_exchange] = await Promise.all([
            assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, channel),
            assertExchange(PAYROLL_EXCHANGE, EXCHANGE_TYPE, channel)
        ]);

        if (!payroll_exchange || !company_exchange) {
            throw new Error("Exchange not asserted");
        }

    } catch (err) {
        console.error("Failed to connect to RabbitMQ", err);
    }
}