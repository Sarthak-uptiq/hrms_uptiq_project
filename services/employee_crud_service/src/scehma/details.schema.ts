import { z } from "zod";

export const UpdateEmpInputSchema = z.object({
  name: z.string().optional(),
  email: z.email().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  existingEmail: z.email(),
});

export type UpdateEmpSchemaType = z.infer<typeof UpdateEmpInputSchema>;

export const GetEmpInputSchema = z
  .object({
    email: z.email(),
    jwt: z.jwt(),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "No credentials provided",
  });

export type GetEmpSchemaType = z.infer<typeof GetEmpInputSchema>;

export const UpdateEmpStatus = z.object({
  statusToUpdate: z.enum(["EMP_STATUS", "POLICY"]),
  status_flag: z.enum(["ACTIVE", "INACTIVE", "TERMINATED", "ACK", "NOT_ACK"]),
  email: z.email(),
});

export type UpdateEmpStatusType = z.infer<typeof UpdateEmpStatus>;
