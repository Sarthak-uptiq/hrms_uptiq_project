import type { Request, Response, NextFunction } from "express";
import { GetEmpInputSchema } from "../scehma/details.schema.ts";
import type { GetEmpSchemaType } from "../scehma/details.schema.ts";

export const validateGetRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const input: GetEmpSchemaType = (req.method === 'GET' ? (req.query as any) : req.body) as GetEmpSchemaType;

    GetEmpInputSchema.safeParse(input);
    console.log("Get input success");
    next();
  } catch (error) {
    console.log("input validatoin failed");

    next(error);
  }
};
