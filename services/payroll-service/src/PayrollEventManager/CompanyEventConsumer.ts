import type { EventType } from "./EventRegistry.js";
import type { IEventConsumer } from "./IEventConsumer.js";
import { ROLE_EVENTS } from "../constants.js";
import { addRole, updateRole } from "../repository/role_event_repository.js";
import { addRoleController, updateRoleController } from "../controller/roles_controller.js";

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