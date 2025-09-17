import { prisma } from "../utils/helper.ts";
import type { AddRoleEventType } from "../schema/role_crud_schema.schema.ts";

export const updateRole = async (role_id: number, role: Partial<{ role_name?: string, total_ctc?: number, allowance?: number, base?: number, bonus?: number }>) => {
    return prisma.rolesProjection.update({
        where: {
            role_id
        },
        data: role
    });
}

export const addRole = async (role: AddRoleEventType) => {
    console.log(role);
    return prisma.rolesProjection.create({
        data: role
    });
}

export const deleteRole = async (role_id: number) => {
    return prisma.rolesProjection.delete({
        where: { role_id }
    }
    );
}

export const getAllRoles = async () => {
    return prisma.rolesProjection.findMany();
}