import { z } from "zod";
export const UpdateRoleEventSchema = z.object({
    role_id: z.int(),
    role_name: z.string().optional(),
    total_ctc: z.number().optional(),
    allowance: z.number().optional(),
    bonus: z.number().optional(),
    base_salary: z.number().optional()
});
export const AddRoleEventSchema = z.object({
    role_id: z.int(),
    role_name: z.string(),
    total_ctc: z.number(),
    allowance: z.number(),
    bonus: z.number(),
    base_salary: z.number()
});
export const DeleteRoleEventSchema = z.object({
    role_id: z.int()
});
