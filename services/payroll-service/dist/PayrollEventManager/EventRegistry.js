import { ROLE_EVENTS, PAYROLL_INITIATE_EVENT } from "../constants.js";
export class EventRegistry {
    registry = {
        [ROLE_EVENTS.ROLE_CREATE_EVENT]: [],
        [ROLE_EVENTS.ROLE_UPDATE_EVENT]: [],
        [PAYROLL_INITIATE_EVENT]: []
    };
    registerStrategy = (event, consumer) => {
        this.registry[event].push(consumer);
        // console.log(this.registry);
    };
    getEventRegistry = (event) => {
        return this.registry[event];
    };
}
