import type{ Request, Response, NextFunction } from "express";
import type{ UserInput } from "../schema/auth.schema.ts";
import { UserSchema } from "../schema/auth.schema.ts";

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {

    try {
        const input: UserInput = req.body;
        UserSchema.safeParse(input);
        console.log("Input validation successful");
        next(); 
    } catch (error: any) {
        console.log("input validatoin failed");

        res.status(400).json({
            message: "Input validation failed",
            success: false,
            error: error
        })
    }
}