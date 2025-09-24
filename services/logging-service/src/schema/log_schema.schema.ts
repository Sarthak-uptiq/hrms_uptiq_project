import { z } from "zod";

export const EmpLogSchema = z.object({
    action:   z.enum(["CREATE", "UPDATE", "DELETE"]),
    employeeId: z.string(),    
    actorId: z.string(),
    status:  z.enum(["SUCCESS", "FAILED"]),
    error: z.string().optional()
});

export type EmpLogSchemaType = z.infer<typeof EmpLogSchema>;

export const RoleLogSchema = z.object({
    action:   z.enum(["CREATE", "UPDATE", "DELETE"]),
    employeeId: z.string(),    
    actorId: z.string(),
    status:  z.enum(["SUCCESS", "FAILED"]),
    error: z.string().optional()
});

export type RoleLogSchemaType = z.infer<typeof RoleLogSchema>;

export const DepLogSchema = z.object({
    action:   z.enum(["CREATE", "UPDATE", "DELETE"]),
    employeeId: z.string(),    
    actorId: z.string(),
    status:  z.enum(["SUCCESS", "FAILED"]),
    error: z.string().optional()
});

export type DepLogSchemaType = z.infer<typeof DepLogSchema>;

export const NotificationLogSchema = z.object({
    action:   z.enum(["CREATE", "UPDATE", "DELETE"]),
    recipeientId: z.string(),    
    type: z.string(),
    status:  z.enum(["SUCCESS", "FAILED"]),
    subject: z.string().optional(),
    error: z.string().optional()
});

export type NotificationLogSchemaType = z.infer<typeof NotificationLogSchema>;