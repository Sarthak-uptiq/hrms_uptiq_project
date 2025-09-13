import { z } from "zod";

export const UpdateEmpInputSchema = z.object({
  name: z.string().optional(),
  email: z.email().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
});

export type UpdateEmpSchemaType = z.infer<typeof UpdateEmpInputSchema>;

export const UpdateEmpStatus = z.object({
  statusToUpdate: z.enum(["EMP_STATUS", "POLICY"]),
  status_flag: z.enum(["ACTIVE", "INACTIVE", "ACK", "NOT_ACK"]),
});

export type UpdateEmpStatusType = z.infer<typeof UpdateEmpStatus>;
