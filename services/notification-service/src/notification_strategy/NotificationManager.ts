
import { NotificationRegistry } from "./NotificationRegistry.ts";
import { NotificationDispatcher } from "./NotificationDispatcher.ts";
import { EmailStrategy } from "./EmailStrategy.ts";
import type { NotificationSchemaType } from "../schema/notification.schema.ts";

export class NotificationManager {
    private dispatcher!: NotificationDispatcher;

    init(): NotificationDispatcher {
        const registry = new NotificationRegistry();

        registry.registerStrategy("user.registered", new EmailStrategy());

        this.dispatcher = new NotificationDispatcher(registry);
        return this.dispatcher;
    }

    getDispatcher(): NotificationDispatcher {
        if (!this.dispatcher) {
        throw new Error("NotificationManager not initialized");
        }
        return this.dispatcher;
    }

    async consume(event: string, payload: NotificationSchemaType) {
        console.log("Consuming event in NotificationManager:", event, payload);
        await this.dispatcher.dispatch(event, payload);
    }
}

    