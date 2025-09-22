import { NotificationRegistry } from "./NotificationRegistry.js";
import type { NotificationSchemaType } from "../schema/notification.schema.js";

export class NotificationDispatcher {
    private registry: NotificationRegistry;

    constructor(registry: NotificationRegistry) {
        this.registry = registry;
    }

    async dispatch(event: string, payload: NotificationSchemaType) {
        const strategies = this.registry.getStrategies(event as any);
        for (const strategy of strategies) {
            await strategy.sendNotification(payload);
        }
    }
}