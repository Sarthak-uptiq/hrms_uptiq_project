// src/api/hr.ts
import axios from "axios";

// This invalid import is now REMOVED:
// import type { addRoleSchemaType, editRoleSchemaType } from "../scehma/hr.schema";

// This new API instance points to your HR routes.
const api = axios.create({
  baseURL: "http://localhost:3000/api/hr", 
  withCredentials: true, // This sends the auth cookie with every request
});

// --- Types (Manually defined for the Frontend) ---

// CORRECTED TYPE:
export type EmployeeData = {
  emp_id: string;
  name: string;
  email: string;
  city: string;             // <-- ADDED
  state: string;            // <-- ADDED
  pincode: string;          // <-- ADDED
  status: string;
  policy_ack_status: string; // <-- ADDED
  department: { dep_name: string };
  role: { 
    role_name: string;
    // You can add the compensation fields here too if you need them
    total_ctc: number; 
    base_salary: number;
    // ...etc
  };
};

export type RoleData = {
  role_id: number;
  role_name: string;
  total_ctc: number;
  base_salary: number;
  bonus: number;
  allowance: number;
};

export type DepartmentData = {
  dep_id: number;
  dep_name: string;
};

// This type mirrors your backend 'addEmployeeSchema'
export type NewEmployeePayload = {
  name: string;
  email: string;
  city: string;
  state: string;
  pincode: string;
  role_id: number;
  dep_id: number;
};

// --- ADDED THIS TYPE ---
// This type mirrors your backend 'addRoleSchema'
export type AddRolePayload = {
  role_name: string;
  total_ctc: number;
  base_salary: number;
  bonus: number;
  allowance: number;
};

// --- ADDED THIS TYPE ---
// This type mirrors your backend 'editRoleSchema'
export type EditRolePayload = {
  role_name?: string;
  total_ctc?: number;
  base_salary?: number;
  bonus?: number;
  allowance?: number;
};


// --- API Functions ---

// == Employee Management ==
export const getAllEmployees = async (): Promise<EmployeeData[]> => {
  const res = await api.get("/get-all-employees");
  return res.data.employees;
};

export const addEmployee = async (payload: NewEmployeePayload) => {
  const res = await api.post("/add-employee", payload);
  return res.data;
};

export const terminateEmployee = async (email: string) => {
  const res = await api.put("/terminate-employee", { email });
  return res.data;
};

// == Department Management ==
export const getAllDepartments = async (): Promise<DepartmentData[]> => {
  const res = await api.get("/get-all-departments");
  return res.data.departments;
};

export const addDepartment = async (dep_name: string) => {
  const res = await api.post("/add-department", { dep_name });
  return res.data;
};

export const editDepartment = async (dep_id: number, dep_name: string) => {
  const res = await api.put(`/edit-department/${dep_id}`, { dep_name });
  return res.data;
};

// == Role Management ==
export const getAllRoles = async (): Promise<RoleData[]> => {
  const res = await api.get("/get-all-roles");
  return res.data.roles;
};

// This function signature is NOW UPDATED to use our manual frontend type
export const addRole = async (payload: AddRolePayload) => {
  const res = await api.post("/add-role", payload);
  return res.data;
};

// This function signature is NOW UPDATED to use our manual frontend type
export const editRole = async (role_id: number, payload: EditRolePayload) => {
  const res = await api.put(`/edit-role/${role_id}`, payload);
  return res.data;
};