import { prisma } from "../utils/helper.js";
export const updateRole = async (role_id, role) => {
    return prisma.rolesProjection.update({
        where: {
            role_id
        },
        data: role
    });
};
export const addRole = async (role) => {
    console.log(role);
    return prisma.rolesProjection.create({
        data: role
    });
};
export const deleteRole = async (role_id) => {
    return prisma.rolesProjection.delete({
        where: { role_id }
    });
};
export const getAllRoles = async () => {
    return prisma.rolesProjection.findMany();
};
