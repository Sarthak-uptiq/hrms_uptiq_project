import { z } from "zod";

export const addEmployeeSchema = z.object({
  hr_email: z.email(), // HR email for authorization
  name: z.string().min(1),
  email: z.email(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  role_name: z.string().min(1),
  dep_name: z.string().min(1),
});

export const terminateEmployeeSchema = z.object({
  hr_email: z.email(), // HR email for authorization
  email: z.email(), // Employee to terminate
  reason: z.string().min(1).optional(),
});

export const addDepartmentSchema = z.object({
  hr_email: z.email(), // HR email for authorization
  dep_name: z.string().min(1),
});

export const addRoleSchema = z.object({
  hr_email: z.email(), // HR email for authorization
  role_name: z.string().min(1),
  total_ctc: z.number().positive(),
  base_salary: z.number().positive(),
  bonus: z.number().nonnegative(),
  allowance: z.number().nonnegative(),
});
