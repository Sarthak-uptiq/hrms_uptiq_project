import { z } from "zod";

export const UserSchema = z.object({
    email: z.string(),
    password: z.string(),
    role: z.enum(["ADMIN", "HR", "EMPLOYEE"])
});

export type UserInput = z.infer<typeof UserSchema>;
