export const consumeEvent = async (channel, queueName, onMessage) => {
    try {
        channel.consume(queueName, (msg) => {
            if (msg) {
                console.log("Recieved event", JSON.parse(msg.content.toString()));
                channel.ack(msg);
                onMessage(msg);
            }
        });
    }
    catch (error) {
        throw new Error("Error in consuming event");
    }
};
