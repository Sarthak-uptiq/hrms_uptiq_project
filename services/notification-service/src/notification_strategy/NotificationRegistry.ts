import type { INotification } from "./INotification.js";

export type EventType = "user.registered";

export class NotificationRegistry {
  private strategyRegistry: Record<EventType, INotification[]> = {
    "user.registered": []
  };

  registerStrategy(eventType: EventType, strategy: INotification) {
    this.strategyRegistry[eventType].push(strategy);
  }

  getStrategies(eventType: EventType): INotification[] {
    return this.strategyRegistry[eventType];
  }
}
