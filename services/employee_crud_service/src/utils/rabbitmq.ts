import amqp from 'amqplib';

let channel: amqp.Channel | null = null;

export async function connectRabbitMQ() {
    try {
        const connection = await amqp.connect(`${process.env.RABBITMQ_URL}`);
        channel = await connection.createChannel();

        if (!channel) {
            throw new Error("Error in connecting to RabbitMQ");
        }

    } catch (error) {
        return { error: error };
    }
}

export function getChannel() {
    if (!channel) {
        return null;
    }

    return channel;
}

export async function assertExchange(EXCHANGE_NAME: string, EXCHANGE_TYPE: string, channel: amqp.Channel) {
    try {
        await channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, {
            durable: true
        });

        return { message: "Exchange asserted" };
    } catch (error) {
        return { message: "Exchange not asserted" };
    }
}

export function publishMessage(EXCHANGE_NAME: string, routingKey: string, message: any) {
    if (!channel) {
        throw new Error("Channel is not created");
    }

    channel.publish(EXCHANGE_NAME, routingKey, Buffer.from(JSON.stringify(message)), { persistent: true });
    console.log("Message published to exchange");
}