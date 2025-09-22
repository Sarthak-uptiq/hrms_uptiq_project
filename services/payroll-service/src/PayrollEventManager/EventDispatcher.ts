import { EventRegistry, type EventType } from "./EventRegistry.js";


export class EventDispatcher {
    private registry: EventRegistry;

    constructor(registry: EventRegistry) {
        this.registry = registry;
    }

    dispatch = async (event: string, payload: any) => {
        const eventConsumers = this.registry.getEventRegistry(event);
        console.log(eventConsumers);
        for (const eventConsumer of eventConsumers) {
            try {
                await eventConsumer.consumeEvent(event, payload);
            } catch (error) {
                console.log("error: ", error);
            }
        }
    }
}