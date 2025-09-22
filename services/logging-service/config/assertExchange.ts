import { getChannel } from "./connectMQ.ts";
import { EXCHANGE_TYPE } from "../constants.ts";


export async function assertExchange(EXCHANGE_NAME: string) {
  const channel = getChannel();
  if (!channel) {
    throw new Error("Channel is not initialized");
  }

  try {
    await channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, {
      durable: true,
    });

    console.log(`Exchange ${EXCHANGE_NAME} asserted successfully`);
  } catch (error) {
    console.error("Error in asserting exchange:", error);
    throw error;
  }
}   