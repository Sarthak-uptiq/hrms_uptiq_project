import { eventConsumer } from "./eventConsumer.js";
import { PAYROLL_EXCHANGE, PAYROLL_INITIATE_EVENT, PAYROLL_QUEUE_NAME } from "../constants.js";
export const payrollConsumer = async () => {
    try {
        await eventConsumer(PAYROLL_EXCHANGE, PAYROLL_QUEUE_NAME, PAYROLL_INITIATE_EVENT);
    }
    catch (error) {
        return { message: "Channel assertion failed" };
    }
};
