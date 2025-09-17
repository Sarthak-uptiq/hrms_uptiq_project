import {z} from "zod";

export const UpdateRoleEventSchema = z.object({
    role_id: z.int(),
    role_name: z.string().optional(),
    total_ctc: z.number().optional(),
    allowance: z.number().optional(),
    bonus: z.number().optional(),
    base: z.number().optional()
});

export type UpdateRoleEventType = z.infer<typeof UpdateRoleEventSchema>;

export const AddRoleEventSchema = z.object({
    role_id: z.int(),
    role_name: z.string(),
    total_ctc: z.number(),
    allowance: z.number(),
    bonus: z.number(),
    base: z.number()
});

export type AddRoleEventType = z.infer<typeof AddRoleEventSchema>;

export const DeleteRoleEventSchema = z.object({
    role_id: z.int()
});

export type DeleteRoleEventType = z.infer<typeof DeleteRoleEventSchema>;