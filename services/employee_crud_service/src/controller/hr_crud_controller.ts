import type { Request, Response, NextFunction } from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import type {
  addDepartmentSchemaType,
  addEmployeeSchemaType,
  addRoleSchemaType,
  terminateEmployeeSchemaType,
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
import {publicKey} from "../utils.ts";

const getHREMail = (token: string): string | null => {
  const decoded: jwt.JwtPayload = jwt.verify(token, publicKey) as jwt.JwtPayload;

  if(!decoded){
    return null;
  }

  return decoded.email;
}

export const addEmployeeController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body: addEmployeeSchemaType = req.body as addEmployeeSchemaType;

    const hr_email = getHREMail(req.cookies.auth_token);

    if(!hr_email){
      return res.status(403).json({ message: "Unauthorized: Not HR" });
    }

    if (!(await isHR(hr_email))) {
      return res.status(403).json({ message: "Unauthorized: Not HR" });
    }
    const role = await getRoleByName(body.role_name);
    const department = await getDepartmentByName(body.dep_name);
    if (!role || !department) {
      return res.status(404).json({ message: "Role or Department not found" });
    }
    const hrUser = await getHRUser(hr_email);
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

    await axios.post("http://localhost:5000/api/auth/register", {
      email: body.email,
      role: role.role_id === 1 ? "HR" : "EMPLOYEE",
    }, {
      headers: {
        Authorization: `Bearer ${req.cookies.auth_token}`,
      }
    });
    return res.status(201).json({ message: "Employee added", employee });
  } catch (err) {
    next(err);
  }
};

export const terminateEmployeeController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body: terminateEmployeeSchemaType = req.body as terminateEmployeeSchemaType;

    const hr_email = getHREMail(req.cookies.auth_token);

    if(!hr_email){
      return res.status(403).json({ message: "Unauthorized: Not HR" });
    }

    if (!(await isHR(hr_email))) {
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
    const body: addEmployeeSchemaType = req.body as addEmployeeSchemaType;

    const hr_email = getHREMail(req.cookies.auth_token);

    if(!hr_email){
      return res.status(403).json({ message: "Unauthorized: Not HR" });
    }

    if (!(await isHR(hr_email))) {
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
    const body: addRoleSchemaType = req.body as addRoleSchemaType;

    const hr_email = getHREMail(req.cookies.auth_token);

    if(!hr_email){
      return res.status(403).json({ message: "Unauthorized: Not HR" });
    }


    if (!(await isHR(hr_email))) {
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
