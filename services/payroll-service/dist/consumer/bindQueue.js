export async function bindQueue(channel, queueName, exchangeName, routingKey) {
    if (!channel) {
        throw new Error("Channel is not initialized");
    }
    try {
        await channel.assertQueue(queueName, { durable: true });
        await channel.bindQueue(queueName, exchangeName, routingKey, {
            persistent: true
        });
        console.log(`Queue ${queueName} bound to exchange ${exchangeName} with routing key`);
    }
    catch (error) {
        console.error("Error in binding queue:", error);
        throw error;
    }
}
