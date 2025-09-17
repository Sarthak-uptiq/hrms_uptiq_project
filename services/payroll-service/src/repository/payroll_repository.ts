import type { PayrollSchemaType } from "../schema/payroll.schema.ts";
import {prisma} from "../utils/helper.ts";

export const getAllPayrolls = async () => {
    return prisma.payroll.findMany();
}

export const addPayroll = async (payload: PayrollSchemaType) => {
    return prisma.payroll.create({
        data: payload
    }
    )
}

export const getAllTaxSlabs = async () => {
    return prisma.taxSlab.findMany();
}