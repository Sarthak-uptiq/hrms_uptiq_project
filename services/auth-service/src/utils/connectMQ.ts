import amqp from "amqplib";

export const EXCHANGE_NAME = "company_events";
const EXCHANGE_TYPE = "topic";

let channel: amqp.Channel | null = null;

export async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(`${process.env.RABBITMQ_URL}`);
    channel = await connection.createChannel();

    await channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, {
      durable: true,
    });

  } catch (error) {
    throw new Error("Error in connecting to RabbitMQ");
  }
}

export function getChannel(): amqp.Channel | null {
  return channel;
}