import { z } from "zod";

export const UserSchema = z.object({
    email: z.email(),
    password: z.string(),
    role: z.enum(["ADMIN", "HR", "EMPLOYEE", "CANDIDATE"])
});

export type UserInput = z.infer<typeof UserSchema>;
