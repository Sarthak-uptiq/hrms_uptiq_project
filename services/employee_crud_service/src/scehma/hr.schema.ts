import { z } from "zod";

export const addEmployeeSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  city: z.string(),
  state: z.string(),
  pincode: z.string(),
  role_id: z.number().positive(),
  dep_id: z.number().positive(),
});

export type addEmployeeSchemaType = z.infer<typeof addEmployeeSchema>;

export const terminateEmployeeSchema = z.object({
  email: z.email(), // Employee to terminate
  reason: z.string().min(1).optional(),
});

export type terminateEmployeeSchemaType = z.infer<typeof terminateEmployeeSchema>;

export const addDepartmentSchema = z.object({
  dep_name: z.string().min(1),
});

export type addDepartmentSchemaType = z.infer<typeof addDepartmentSchema>;

export const addRoleSchema = z.object({
  role_name: z.string().min(1),
  total_ctc: z.number().positive(),
  base_salary: z.number().positive(),
  bonus: z.number().nonnegative(),
  allowance: z.number().nonnegative(),
});

export type addRoleSchemaType = z.infer<typeof addRoleSchema>;

export const editRoleSchema = z.object({
  role_name: z.string().min(1).optional(),
  total_ctc: z.number().positive().optional(),
  base_salary: z.number().positive().optional(),
  bonus: z.number().nonnegative().optional(),
  allowance: z.number().nonnegative().optional(),
});

export type editRoleSchemaType = z.infer<typeof editRoleSchema>;

export const editDepartmentSchema = z.object({
  dep_name: z.string().min(1),
});

export type editDepartmentSchemaType = z.infer<typeof editDepartmentSchema>;
