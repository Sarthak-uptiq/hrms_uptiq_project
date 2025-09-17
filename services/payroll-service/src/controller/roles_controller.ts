import { addRole, getAllRoles, updateRole } from "../repository/role_event_repository.ts";
import type { AddRoleEventType, UpdateRoleEventType } from "../schema/role_crud_schema.schema.ts"


export const updateRoleController = async (payload: any, role_id: number) => {
    try {
        if (!payload) {
            return { status: 400, message: "Invalid payload" };
        }

        const role = await updateRole(role_id, payload as Partial<
            { role_name?: string, total_ctc?: number, allowance?: number, base?: number, bonus?: number }>);
        console.log("Role updated:", role);
        return { status: 201, message: "Notification updatedsuccessfully", data: role };
    } catch (error) {
        console.log(error);
        return { status: 400, message: "Failed to update role", error };
    }
}

export const addRoleController = async (payload: AddRoleEventType) => {
    try {
        if (!payload) {
            return { status: 400, message: "Invalid payload" };
        }

        const role = await addRole(payload);
        console.log("Role added:", role);
        return { status: 201, message: "Notification created successfully", data: role };
    } catch (error) {
        console.log(error);
        return { status: 400, message: "Failed to add role", error };
    }
}