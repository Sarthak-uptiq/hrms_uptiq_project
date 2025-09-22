import { prisma } from "../utils/helper.js";
export const getAllPayrolls = async () => {
    return prisma.payroll.findMany();
};
export const addPayroll = async (payload) => {
    return prisma.payroll.create({
        data: payload
    });
};
export const getAllTaxSlabs = async () => {
    return prisma.taxSlab.findMany();
};
