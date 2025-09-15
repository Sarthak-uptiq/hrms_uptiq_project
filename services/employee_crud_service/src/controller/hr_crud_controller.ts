import type { Request, Response, NextFunction } from "express";
import axios from "axios";
import type {
  addDepartmentSchemaType,
  addEmployeeSchemaType,
  addRoleSchemaType,
  terminateEmployeeSchemaType,
} from "../scehma/hr.schema.ts";
import { editDepartmentSchema, editRoleSchema } from "../scehma/hr.schema.ts";
import {
  isHR,
  getRoleById,
  getDepartmentById,
  addEmployee,
  terminateEmployee,
  getAllEmployees,
  addDepartment,
  addRole,
  getHRUser,
  getAllDepartments,
  getAllRoles,
  editRole,
  editDepartment,
} from "../repository/hr_crud_repository.ts";
import { publishEmpAddMessage } from "../utils/rabbitmq.ts";
import { request } from "http";

export const addEmployeeController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body: addEmployeeSchemaType = req.body as addEmployeeSchemaType;

    const hr_email = req.userEmail;
    console.log("HR Email:", hr_email);

    if(!hr_email){
      return res.status(403).json({ message: "Unauthorized: Not HR" });
    }

    if (!(await isHR(hr_email))) {
      return res.status(403).json({ message: "Unauthorized: Not HR" });
    }

    console.log(body.role_id, body.dep_id);

    const role = await getRoleById(body.role_id);
    const department = await getDepartmentById(body.dep_id);
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

    // await axios.post("http://localhost:3000/api/auth/register", {
    //   email: employee.email,
    //   role: role.role_id === 1 ? "HR" : "EMPLOYEE",
    //   role_id: employee.emp_id
    // }, {
    //   headers: {
    //     Authorization: `Bearer ${req.cookies.auth_token}`,
    //   }
    // });
    
    publishEmpAddMessage("employee.created", {
      email: employee.email,
      role: role.role_id === 3 ? "HR" : "EMPLOYEE",
      user_id: employee.emp_id,
      requested_by: hrUser.emp_id
    });
    return res.status(201).json({ message: "Employee added", employee });
  } catch (err) {
    next(err);
  }
};

export const terminateEmployeeController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body: terminateEmployeeSchemaType = req.body as terminateEmployeeSchemaType;

    const hr_email = req.userEmail;

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
    const body: addDepartmentSchemaType = req.body as addDepartmentSchemaType;

    const hr_email = req.userEmail;

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

    const hr_email = req.userEmail;

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


export const getAllDepartmentsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const departments = await getAllDepartments();
    return res.status(200).json({ departments });
  } catch (err) {
    next(err);
  }
};

export const getAllRolesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roles = await getAllRoles();
    return res.status(200).json({ roles });
  } catch (err) {
    next(err);
  }
};

export const getRoleInfoController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const role_id = parseInt(req.params.role_id!);
    if (isNaN(role_id)) {
      return res.status(400).json({ message: "Invalid role ID" });
    }

    const role = await getRoleById(role_id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }
    return res.status(200).json({ role });
  } catch (err) {
    next(err);
  }
}

export const editRoleController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const role_id = parseInt(req.params.role_id!);
    if (isNaN(role_id)) {
      return res.status(400).json({ message: "Invalid role ID" });
    }

    const updates = req.body as Partial<addRoleSchemaType>;

    const hr_email = req.userEmail;

    if(!hr_email){
      return res.status(403).json({ message: "Unauthorized: Not HR" });
    }

    if (!(await isHR(hr_email))) {
      return res.status(403).json({ message: "Unauthorized: Not HR" });
    }

    const role = await editRole(role_id, updates);
    return res.status(200).json({ message: "Role updated", role });
  } catch (err) {
    next(err);
  }
};

export const editDepartmentController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dep_id = parseInt(req.params.dep_id!);
    if (isNaN(dep_id)) {
      return res.status(400).json({ message: "Invalid department ID" });
    }

    const updates = editDepartmentSchema.parse(req.body);

    const hr_email = req.userEmail;

    if(!hr_email){
      return res.status(403).json({ message: "Unauthorized: Not HR" });
    }

    if (!(await isHR(hr_email))) {
      return res.status(403).json({ message: "Unauthorized: Not HR" });
    }

    const department = await editDepartment(dep_id, updates);
    return res.status(200).json({ message: "Department updated", department });
  } catch (err) {
    next(err);
  }
};