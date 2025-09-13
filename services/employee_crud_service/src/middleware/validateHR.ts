import type { Request, Response, NextFunction } from "express";
import {
  addEmployeeSchema,
  terminateEmployeeSchema,
  addDepartmentSchema,
  addRoleSchema,
  editRoleSchema,
  editDepartmentSchema,
} from "../scehma/hr.schema.ts";

const schemaMap: Record<string, any> = {
  "/hr/add-employee": addEmployeeSchema,
  "/hr/terminate-employee": terminateEmployeeSchema,
  "/hr/add-department": addDepartmentSchema,
  "/hr/add-role": addRoleSchema,
  "/hr/edit-role/:role_id": editRoleSchema,
  "/hr/edit-department/:dep_id": editDepartmentSchema,
};

export function validateHR(req: Request, res: Response, next: NextFunction) {
  const schema = schemaMap[req.route.path];
  if (!schema) return next();
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    next(err);
  }
}