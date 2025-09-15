import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import type{Request, Response, NextFunction} from "express";
import type{ UserInput, RegisterSchemaType } from "../schema/auth.schema.ts";
import {createUser, findByUserID, findExistingUser } from "../repository/repository.ts";
import bcrypt from "bcrypt";
import fs from "fs";
import generator from 'generate-password';
import { publishUserCreatedMessage } from '../utils/publishMessage.ts';

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

export const register = async (eventMessage: RegisterSchemaType) => {
    try{
        const userExists: boolean = (await findExistingUser(eventMessage.email))?true:false;

        if(userExists){
            return {message: "User already exists"};
        }

        const requestingUser = await findByUserID(eventMessage.requested_by);

        if(!requestingUser){
            return {message: "Requesting user not found"};
        }

        if(requestingUser.authrole!=="HR"){
            return {message: "Only HR can register a user"};
        }

        const randPassword = generatePassword();
        const user = await createUser(eventMessage, randPassword);

        console.log("User created successfully", {user: user.email, role: user.authrole, user_id: user.user_id});
        
        publishUserCreatedMessage("user.created", {
            subject: "User Credentials",
            body: `Your account has been created. Your login credentials are:\n Email: ${user.email}\n Password: ${randPassword}`,
            recipient: user.email
        });
        
        return {message: "User created successfully", user: {user: user.email, role: user.authrole, user_id: user.user_id}};
    } catch(error){
        console.log(`Error in registering user: ${error}`);
        return {message: "Error in registering user"};
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

        console.log("user present");
        res.cookie("auth_token", token, { httpOnly: true, sameSite: "lax", secure: true, domain: "localhost", maxAge: 60*60*1000});
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

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie('auth_token', { httpOnly: true, sameSite: "lax", secure: true, domain: "localhost"});
        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.log(`Error in logout: ${error}`);
        next(error);
    }
};