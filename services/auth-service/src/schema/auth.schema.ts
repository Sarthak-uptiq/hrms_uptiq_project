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
    requestingUserId: z.string(),
    requestingUserRole: z.enum(["HR"])
});

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
