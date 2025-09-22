import type { IEventConsumer } from "./IEventConsumer.js";
import { ROLE_EVENTS, PAYROLL_INITIATE_EVENT } from "../constants.js"

export type EventType =
    typeof ROLE_EVENTS.ROLE_CREATE_EVENT |
    typeof ROLE_EVENTS.ROLE_UPDATE_EVENT |
    typeof PAYROLL_INITIATE_EVENT;

export class EventRegistry {
    private registry: Record<EventType, IEventConsumer[]> = {
        [ROLE_EVENTS.ROLE_CREATE_EVENT]: [],
        [ROLE_EVENTS.ROLE_UPDATE_EVENT]: [],
        [PAYROLL_INITIATE_EVENT]: []
    };

    registerStrategy = (event: EventType, consumer: IEventConsumer) => {
        this.registry[event]!.push(consumer);
        // console.log(this.registry);
    }

    getEventRegistry = (event: EventType): IEventConsumer[] => {
        return this.registry[event]!;
    }
}