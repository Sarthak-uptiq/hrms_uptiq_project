import {z} from "zod";

export const UpdateEmpInputSchema = z.object({
  name: z.string(),
  email: z.email(),
  city: z.string(),
  state: z.string(),
  pincode: z.string(),
}).partial().refine((data) => Object.keys(data).length > 0, {message: "Nothing to be updated"});

export type UpdateEmpSchemaType = z.infer<typeof UpdateEmpInputSchema>;

export const GetEmpInputSchema = z.object({
    email: z.email(),
    jwt: z.jwt()
}).partial().refine((data) => Object.keys(data).length > 0, {message: "No credentials provided"});

export type GetEmpSchemaType = z.infer<typeof GetEmpInputSchema>;