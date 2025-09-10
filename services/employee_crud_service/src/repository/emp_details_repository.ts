import {prisma} from "../utils.ts";
import type { UpdateEmpSchemaType, GetEmpSchemaType } from "../scehma/details.schema.ts";
import { UpdateEmpInputSchema } from "../scehma/details.schema.ts";

export const getEmpDetails = async (reqBody: GetEmpSchemaType) => { 
    if(reqBody.email){
        const email = reqBody.email;
        return prisma.employee.findUnique({
            where: {email}
        })
    }

    return null;
}

export const updateEmpDetails = async (reqBody: UpdateEmpSchemaType, emp_id: string) => {
    const parsed = UpdateEmpInputSchema.parse(reqBody);

    const providedUpdates = Object.fromEntries(
        Object.entries(parsed).filter(([_, value]) => value !== undefined)
    );

    return prisma.employee.update({
        where: {emp_id},
        data: providedUpdates
    });
}