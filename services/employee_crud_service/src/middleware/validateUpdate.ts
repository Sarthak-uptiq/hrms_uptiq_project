import type { Request, Response, NextFunction } from "express";
import { UpdateEmpInputSchema } from "../scehma/details.schema.ts";
import type { UpdateEmpSchemaType } from "../scehma/details.schema.ts";

export const validateUpdateRequest = (req: Request, res: Response, next: NextFunction) => {

    try{
        const input: UpdateEmpSchemaType = req.body;

        UpdateEmpInputSchema.safeParse(input);
        console.log("Update input success");
        next();
    } catch(error){
        console.log("input validatoin failed");

        return res.status(400).json({
            message: "Input validation for update failed",
            success: false,
            error: error
        });
    }
}
