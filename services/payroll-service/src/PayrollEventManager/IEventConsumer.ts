import type { EventType } from "./EventRegistry.ts";

export interface IEventConsumer {
    consumeEvent(event: EventType, payload: any): Promise<void>;
}