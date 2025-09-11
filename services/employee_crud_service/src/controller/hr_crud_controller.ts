import type { Request, Response, NextFunction } from "express";
import axios from "axios";
import {
  addEmployeeSchema,
  terminateEmployeeSchema,
  addDepartmentSchema,
  addRoleSchema,
} from "../scehma/hr.schema.ts";
import {
  isHR,
  getRoleByName,
  getDepartmentByName,
  addEmployee,
  terminateEmployee,
  getAllEmployees,
  addDepartment,
  addRole,
  getHRUser,
} from "../repository/hr_crud_repository.ts";

export const addEmployeeController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = addEmployeeSchema.parse(req.body);
    if (!(await isHR(body.hr_email))) {
      return res.status(403).json({ message: "Unauthorized: Not HR" });
    }
    const role = await getRoleByName(body.role_name);
    const department = await getDepartmentByName(body.dep_name);
    if (!role || !department) {
      return res.status(404).json({ message: "Role or Department not found" });
    }
    const hrUser = await getHRUser(body.hr_email);
    if (!hrUser) {
      return res.status(404).json({ message: "HR user not found" });
    }
    const employee = await addEmployee({
      name: body.name,
      email: body.email,
      city: body.city ?? null,
      state: body.state ?? null,
      pincode: body.pincode ?? null,
      role_id: role.role_id,
      dep_id: department.dep_id,
    });
    // Register employee in auth-service with correct role
    await axios.post("http://localhost:5000/api/auth/register", {
      email: body.email,
      role: role.role_id === 1 ? "HR" : "EMPLOYEE",
      requestingUserId: hrUser.emp_id,
      requestingUserRole: "HR",
    });
    return res.status(201).json({ message: "Employee added", employee });
  } catch (err) {
    next(err);
  }
};

export const terminateEmployeeController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = terminateEmployeeSchema.parse(req.body);
    if (!(await isHR(body.hr_email))) {
      return res.status(403).json({ message: "Unauthorized: Not HR" });
    }
    const employee = await terminateEmployee(body.email);
    return res.status(200).json({ message: "Employee terminated", employee });
  } catch (err) {
    next(err);
  }
};

export const getAllEmployeesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const employees = await getAllEmployees();
    return res.status(200).json({ employees });
  } catch (err) {
    next(err);
  }
};

export const addDepartmentController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = addDepartmentSchema.parse(req.body);
    if (!(await isHR(body.hr_email))) {
      return res.status(403).json({ message: "Unauthorized: Not HR" });
    }
    const department = await addDepartment(body.dep_name);
    return res.status(201).json({ message: "Department added", department });
  } catch (err) {
    next(err);
  }
};

export const addRoleController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = addRoleSchema.parse(req.body);
    if (!(await isHR(body.hr_email))) {
      return res.status(403).json({ message: "Unauthorized: Not HR" });
    }
    const role = await addRole({
      role_name: body.role_name,
      total_ctc: body.total_ctc,
      base_salary: body.base_salary,
      bonus: body.bonus,
      allowance: body.allowance,
    });
    return res.status(201).json({ message: "Role added", role });
  } catch (err) {
    next(err);
  }
};
