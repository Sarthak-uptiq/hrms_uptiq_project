import type { EventType } from "./EventRegistry.ts";
import type { IEventConsumer } from "./IEventConsumer.ts";
import { ROLE_EVENTS } from "../constants.ts";
import { addRole, updateRole } from "../repository/role_event_repository.ts";
import { addRoleController, updateRoleController } from "../controller/roles_controller.ts";

export class CompanyEventConsumer implements IEventConsumer {
    async consumeEvent(event: EventType, payload: any): Promise<void> {
        console.log("reached");
        if (event === ROLE_EVENTS.ROLE_CREATE_EVENT) {
            await addRoleController(payload.role);
        } else {
            await updateRoleController(payload.role, payload.role_id);
        }
    }
}