import {z} from "zod";

export const PayrollSchema = z.object({
    total_employees:  z.int(),
    gross_amount:    z.number(),
    net_amount:      z.number(),
    status:          z.string(),
});

export type PayrollSchemaType = z.infer<typeof PayrollSchema>;

export const PayrollEventSchema = z.object({
    role_name: z.string(),
    role_emp_count: z.int()
});

export type PayRollEventSchemaType = z.infer<typeof PayrollEventSchema>;
