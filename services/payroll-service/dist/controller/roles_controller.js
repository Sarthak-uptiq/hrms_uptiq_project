import { addRole, updateRole } from "../repository/role_event_repository.js";
export const updateRoleController = async (payload, role_id) => {
    try {
        if (!payload) {
            return { status: 400, message: "Invalid payload" };
        }
        const role = await updateRole(role_id, payload);
        console.log("Role updated:", role);
        return { status: 201, message: "Notification updatedsuccessfully", data: role };
    }
    catch (error) {
        console.log(error);
        return { status: 400, message: "Failed to update role", error };
    }
};
export const addRoleController = async (payload) => {
    try {
        if (!payload) {
            return { status: 400, message: "Invalid payload" };
        }
        const role = await addRole(payload);
        console.log("Role added:", role);
        return { status: 201, message: "Notification created successfully", data: role };
    }
    catch (error) {
        console.log(error);
        return { status: 400, message: "Failed to add role", error };
    }
};
