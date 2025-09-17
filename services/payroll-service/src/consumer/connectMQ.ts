import amqp from "amqplib";

let channel: amqp.Channel | null = null;

export async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(`${process.env.RABBITMQ_URL}`);
    channel = await connection.createChannel();

    console.log("Connected to RabbitMQ");

  } catch (error) {
    throw new Error("Error in connecting to RabbitMQ");
  }
}

export function getChannel(): amqp.Channel | null {
  return channel;
}