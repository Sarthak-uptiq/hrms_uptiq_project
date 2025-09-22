import { PAYROLL_INITIATE_EVENT, ROLE_EVENTS } from "../constants.js";
import { CompanyEventConsumer } from "./CompanyEventConsumer.js";
import { EventDispatcher } from "./EventDispatcher.js";
import { EventRegistry } from "./EventRegistry.js";
import { PayrollEventConsumer } from "./PayrollEventConsumer.js";
export class EventManager {
    dispatcher;
    init() {
        const registry = new EventRegistry();
        registry.registerStrategy(ROLE_EVENTS.ROLE_CREATE_EVENT, new CompanyEventConsumer());
        registry.registerStrategy(ROLE_EVENTS.ROLE_UPDATE_EVENT, new CompanyEventConsumer());
        registry.registerStrategy(PAYROLL_INITIATE_EVENT, new PayrollEventConsumer());
        console.log(registry.getEventRegistry(PAYROLL_INITIATE_EVENT));
        this.dispatcher = new EventDispatcher(registry);
        return this.dispatcher;
    }
    async consume(event, payload) {
        console.log("Reached");
        try {
            await this.dispatcher.dispatch(event, payload);
        }
        catch (error) {
            console.log(error);
            return;
        }
    }
}
