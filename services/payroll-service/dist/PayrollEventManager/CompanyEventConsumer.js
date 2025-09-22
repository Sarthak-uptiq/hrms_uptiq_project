import { ROLE_EVENTS } from "../constants.js";
import { addRoleController, updateRoleController } from "../controller/roles_controller.js";
export class CompanyEventConsumer {
    async consumeEvent(event, payload) {
        console.log("reached");
        if (event === ROLE_EVENTS.ROLE_CREATE_EVENT) {
            await addRoleController(payload.role);
        }
        else {
            await updateRoleController(payload.role, payload.role_id);
        }
    }
}
