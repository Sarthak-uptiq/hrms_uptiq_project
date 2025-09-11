import type{ Request, Response, NextFunction } from "express";
import type{ UserInput, RegisterSchemaType } from "../schema/auth.schema.ts";
import { UserSchema, RegisterSchema } from "../schema/auth.schema.ts";

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {

    try {
        const input: UserInput = req.body;
        UserSchema.safeParse(input);
        console.log("Input validation successful");
        next(); 
    } catch (error: any) {
        console.log("input validatoin failed");

        return res.status(400).json({
            message: "Input validation failed",
            success: false,
            error: error
        });
    }
}

export const validateRegisterRequest = (req: Request, res: Response, next: NextFunction) => {

    try {
        const input: RegisterSchemaType = req.body;
        RegisterSchema.safeParse(input);
        console.log("Input validation successful");
        next(); 
    } catch (error: any) {
        console.log("input validatoin failed");

        next(error);
    }
}