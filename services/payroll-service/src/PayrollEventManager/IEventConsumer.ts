import type { EventType } from "./EventRegistry.js";

export interface IEventConsumer {
    consumeEvent(event: EventType, payload: any): Promise<void>;
}