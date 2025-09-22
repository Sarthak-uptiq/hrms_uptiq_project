import { editDepartmentSchema, editRoleSchema, type addRoleSchemaType, type editDepartmentSchemaType, type editRoleSchemaType } from "../scehma/hr.schema.js";
import { prisma } from "../utils/utils.js";

export async function isHR(email: string) {
  const hr = await prisma.employee.findUnique({
    where: { email },
    select: { role_id: true },
  });
  return hr && hr.role_id === 3;
}

export async function getRoleById(role_id: number) {
  return prisma.role.findUnique({ where: { role_id } });
}

export async function getDepartmentById(dep_id: number) {
  return prisma.department.findUnique({ where: { dep_id } });
}

export async function addEmployee(data: {
  name: string;
  email: string;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  role_id: number;
  dep_id: number;
}) {
  return prisma.employee.create({
    data: {
      name: data.name,
      email: data.email,
      city: data.city ?? null,
      state: data.state ?? null,
      pincode: data.pincode ?? null,
      role_id: data.role_id,
      dep_id: data.dep_id,
      status: "ACTIVE",
      policy_ack_status: "PENDING",
    },
  });
}

export async function terminateEmployee(email: string) {
  return prisma.employee.update({
    where: { email },
    data: { status: "TERMINATED" },
  });
}

export async function getAllEmployees() {
  return prisma.employee.findMany({
    include: {
      department: { select: { dep_name: true } },
      role: { select: { role_name: true, total_ctc: true, base_salary: true, bonus: true, allowance: true } },
    },
  });
}

export async function addDepartment(dep_name: string) {
  return prisma.department.create({ data: { dep_name } });
}

export async function addRole(data: {
  role_name: string;
  total_ctc: number;
  base_salary: number;
  bonus: number;
  allowance: number;
}) {
  return prisma.role.create({
    data: {
      role_name: data.role_name,
      total_ctc: data.total_ctc,
      base_salary: data.base_salary,
      bonus: data.bonus,
      allowance: data.allowance,
    },
  });
}

export async function getHRUser(email: string) {
  return prisma.employee.findUnique({
    where: { email },
    select: { emp_id: true },
  });
}


// write two functions for getting all department and role details

export async function getAllDepartments() {
  return prisma.department.findMany();
}

export async function getAllRoles() {
  return prisma.role.findMany();
}

export async function getRoleInfo(role_id: number) {
  return prisma.role.findUnique({
    where: { role_id },
  });
}

export async function editRole(role_id: number, updates:
  {
    role_name?: string;
    total_ctc?: number;
    base_salary?: number;
    bonus?: number;
    allowance?: number;
  }) {
  return prisma.role.update({
    where: { role_id },
    data: updates,
  });
}

export async function editDepartment(dep_id: number, updates: { dep_name: string }) {
  return prisma.department.update({
    where: { dep_id },
    data: updates,
  });
}

export async function getEmpRoleCount(role_id: number) {
  return prisma.employee.count({
    where: { role_id }
  });
}