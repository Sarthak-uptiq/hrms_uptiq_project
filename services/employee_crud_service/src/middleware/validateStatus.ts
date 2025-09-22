import type { Request, Response, NextFunction } from "express";
import { UpdateEmpStatus } from "../scehma/details.schema.js";
import type { UpdateEmpStatusType } from "../scehma/details.schema.js";

export const validateEmpStatus = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const input: UpdateEmpStatusType = req.body;

    UpdateEmpStatus.safeParse(input);
    console.log("Update input success");
    next();
  } catch (error) {
    console.log("input validatoin failed");

    next(error);
  }
};
