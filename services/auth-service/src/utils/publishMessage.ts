import { getChannel, EXCHANGE_NAME } from "./connectMQ.ts";


export function publishUserCreatedMessage(routingKey: string, message: any) {
  const channel = getChannel();
  if (!channel) {
    throw new Error("Channel is not created");
  }

  channel.publish(
    EXCHANGE_NAME,
    routingKey,
    Buffer.from(JSON.stringify(message)),
    { persistent: true }
  );
  console.log("Message published to exchange");
}