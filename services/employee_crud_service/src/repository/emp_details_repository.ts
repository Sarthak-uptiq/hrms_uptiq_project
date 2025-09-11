import { prisma } from "../utils.ts";
import type {
  UpdateEmpSchemaType,
  GetEmpSchemaType,
} from "../scehma/details.schema.ts";
import { UpdateEmpInputSchema } from "../scehma/details.schema.ts";

export const getEmpDetails = async (reqBody: GetEmpSchemaType) => {
  if (reqBody.email) {
    const email = reqBody.email;
    return prisma.employee.findUnique({
      where: { email },
    });
  }

  return null;
};

export const updateAckFlag = async (
  flagToUpdate: string,
  updatedValue: string,
  email: string
) => {
  return prisma.employee.update({
    where: { email },
    data: {
      [flagToUpdate]: updatedValue,
    },
  });
};

export const updateEmpDetails = async (
  email: string,
  providedUpdates: { [k: string]: string }
) => {
  return prisma.employee.update({
    where: { email },
    data: providedUpdates,
  });
};
