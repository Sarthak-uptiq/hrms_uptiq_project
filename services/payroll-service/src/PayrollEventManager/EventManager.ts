import { PAYROLL_INITIATE_EVENT, ROLE_EVENTS } from "../constants.ts";
import { CompanyEventConsumer } from "./CompanyEventConsumer.ts";
import { EventDispatcher } from "./EventDispatcher.ts";
import { EventRegistry } from "./EventRegistry.ts";
import { PayrollEventConsumer } from "./PayrollEventConsumer.ts";


export class EventManager {
    private dispatcher!: EventDispatcher;

    init(): EventDispatcher {
        const registry = new EventRegistry();

        registry.registerStrategy(ROLE_EVENTS.ROLE_CREATE_EVENT, new CompanyEventConsumer());
        registry.registerStrategy(ROLE_EVENTS.ROLE_UPDATE_EVENT, new CompanyEventConsumer());
        registry.registerStrategy(PAYROLL_INITIATE_EVENT, new PayrollEventConsumer());

        console.log(registry.getEventRegistry(PAYROLL_INITIATE_EVENT));
        this.dispatcher = new EventDispatcher(registry);
        return this.dispatcher;
    }

    async consume(event: string, payload: any) {
        console.log("Reached");

        try {
            await this.dispatcher.dispatch(event, payload);
        } catch (error) {
            console.log(error);
            return;
        }
    }
}