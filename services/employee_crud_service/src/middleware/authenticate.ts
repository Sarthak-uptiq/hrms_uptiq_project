import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateRequest = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.auth_token;

    if(!token){
        return res.status(401).json({
            message: "User not verified"
        });
    }

    next();
}