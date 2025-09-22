export class EventDispatcher {
    registry;
    constructor(registry) {
        this.registry = registry;
    }
    dispatch = async (event, payload) => {
        const eventConsumers = this.registry.getEventRegistry(event);
        console.log(eventConsumers);
        for (const eventConsumer of eventConsumers) {
            try {
                await eventConsumer.consumeEvent(event, payload);
            }
            catch (error) {
                console.log("error: ", error);
            }
        }
    };
}
