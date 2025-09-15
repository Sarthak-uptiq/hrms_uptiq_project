import { request } from "http";
import { z } from "zod";

export const UserSchema = z.object({
    email: z.email(),
    password: z.string(),
    role: z.enum(["ADMIN", "HR", "EMPLOYEE"])
});

export type UserInput = z.infer<typeof UserSchema>;

export const RegisterSchema = z.object({
    email: z.email(),
    role: z.enum(["HR", "EMPLOYEE"]),
    user_id: z.string(),
    requested_by: z.string()
}).strict();

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
