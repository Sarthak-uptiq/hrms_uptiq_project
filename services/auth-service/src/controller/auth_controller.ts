import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import type{Request, Response, NextFunction} from "express";
import type{ UserInput, RegisterSchemaType } from "../schema/auth.schema.ts";
import {createUser, findExistingUser } from "../repository/repository.ts";
import bcrypt from "bcrypt";
import {v5 as uuidv5} from "uuid";
import fs from "fs";
import generator from 'generate-password';

const EXPIRY: string = process.env.TOKEN_EXPIRY!;
const privateKey = fs.readFileSync("private.pem", "utf-8");

type UserData = {
  id: string;
  email: string;
  role: string;
};


const generateToken = ({ id, email, role }: UserData): string => {
    const payload = {
        id: id,
        email: email,
        role: role
    }
    return jwt.sign( payload, 
        privateKey,  
        {
        algorithm: "RS256", 
        expiresIn: "1h",
        });
};

const generatePassword = (): string => {
    return generator.generate({
    length: 10,
    numbers: true,
    symbols: true,
    uppercase: true,
    lowercase: true,
    excludeSimilarCharacters: true, 
});
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const body = req.body as RegisterSchemaType;
        const userExists: boolean = (await findExistingUser(body.email))?true:false;

        if(userExists){
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        const jwtToken = req.cookies.auth_token;

        if(!jwtToken){
            return res.status(401).json({message: "auth token not found"});
        }

        const decoded: JwtPayload = jwt.verify(jwtToken, privateKey) as JwtPayload;

        if(!decoded){
            return res.status(401).json({message: "JWT payload not found"});
        }


        const requestingUser = await findExistingUser(decoded.email);

        if(!requestingUser){
            return res.status(404).json({message: "Reqesting user does not exist"});
        }

        if(requestingUser.authrole!=="HR"){
            return res.status(404).json({message: "Request Denied: Unauthorized"});
        }

        const NAMESPACE = uuidv5.DNS;
        const uuid = uuidv5(body.email, NAMESPACE);

        const user = await createUser(body, uuid, generatePassword());

        const token = generateToken({
            id: user.user_id,
            email: user.email,
            role: user.authrole
        });

        res.cookie("auth_token", token, { httpOnly: true, sameSite: "lax", maxAge: Number(EXPIRY)});
        return res.status(201).json({message: "User Created successfully"});
    } catch(error){
        console.log(`Error in registering user: ${error}`);
        next(error);
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const body = req.body as UserInput;
        console.log("body", body);

        const userExists = await findExistingUser(body.email);

        if(!userExists){
            return res.status(404).json({
                success: false,
                message: "User does not exists"
            });
        } 

        const isPasssWordCorrect = (body.password === userExists.password);

        if(!isPasssWordCorrect){
            return res.status(401).json({message: "Password Incorrect!!"});
        }

        if(userExists.authrole==="EMPLOYEE" && body.role!=="EMPLOYEE"){
            return res.status(409).json({message: "Invalid role"});
        }

        const token = generateToken({
            id: userExists.user_id,
            email: userExists.email,
            role: userExists.authrole
        });

        console.log("user presnet");
        res.cookie("auth_token", token, { httpOnly: true, sameSite: "lax", maxAge: Number(EXPIRY)});
        return res.status(201).json({message: "User logged in successfully", user: {
            email: userExists.email,
            role: userExists.authrole,
            user_id: userExists.user_id
        }});

    } catch(error){
        console.log(`Error in login: ${error}`);
        next(error);
    }
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.auth_token;

    if(!token){
        return res.status(401).json({message: "auth token not found"});
    }

    try{

        const decoded: jwt.JwtPayload = jwt.verify(token, privateKey) as jwt.JwtPayload;

        const user: UserData = {
            email: decoded.email, 
            id: decoded.id,
            role: decoded.role
        }; 

        return res.status(200).json({ user: user });

    } catch(error){
        console.log("Error in decoding token :", error);
        next(error);
    }
}