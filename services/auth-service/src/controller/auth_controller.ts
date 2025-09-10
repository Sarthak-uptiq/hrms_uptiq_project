import jwt from 'jsonwebtoken';
import type{Request, Response} from "express";
import type{ UserInput } from "../schema/auth.schema.ts";
import {createUser, findExistingUser } from "../repository/repository.ts";
import bcrypt from "bcrypt";


const JWT_SECRET_KEY: string  = process.env.SECRET_KEY!;
const EXPIRY: string = process.env.TOKEN_EXPIRY!;

type UserData = {
  id: Number;
  email: string;
  role: string;
};


const generateToken = ({ id, email, role }: UserData): string => {
    const payload = {
        id: id,
        email: email,
        role: role
    }
    return jwt.sign( payload, JWT_SECRET_KEY, {expiresIn: Number(EXPIRY)});
};

export const register = async (req: Request, res: Response) => {
    try{
        const body = req.body as UserInput;
        const userExists: boolean = (await findExistingUser(body.email))?true:false;

        if(userExists){
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        if(body.role != "CANDIDATE"){
            return res.status(409).json({
                success: false,
                message: "User not allowed to register"
            });
        }

        const user = await createUser(body);

        const token = generateToken({
            id: user.user_id,
            email: user.email,
            role: user.authrole
        });

        res.cookie("auth_token", token, { httpOnly: true, sameSite: "lax", maxAge: Number(EXPIRY)});
        res.status(201).json({message: "User Created successfully"});
    } catch(error){
        console.log(`Error in registering user: ${error}`);
        res.status(500).json({message: `Server error ${error}`});
    }
}

export const login = async (req: Request, res: Response) => {
    try{
        const body = req.body as UserInput;

        const userExists = await findExistingUser(body.email);

        if(!userExists){
            return res.status(404).json({
                success: false,
                message: "User does not exists"
            });
        } 

        const isPasssWordCorrect = await bcrypt.compare(body.password, userExists.password);

        if(!isPasssWordCorrect){
            return res.status(401).json({message: "Password Incorrect!!"});
        }

        const token = generateToken({
                id: userExists.user_id,
                email: userExists.email,
                role: userExists.authrole
            });

            res.cookie("auth_token", token, { httpOnly: true, sameSite: "lax", maxAge: Number(EXPIRY)});
            res.status(201).json({message: "User logged in successfully"});

    } catch(error){
        console.log(`Error in login: ${error}`);
        res.status(500).json({message: `Server error ${error}`});
    }
}

export const verifyToken = async (req: Request, res: Response) => {
    const token = req.cookies.auth_token;

    if(!token){
        return res.status(401).json({message: "auth token not found"});
    }

    try{

        const decoded: jwt.JwtPayload = jwt.verify(token, JWT_SECRET_KEY) as jwt.JwtPayload;

        const user: UserData = {
            email: decoded.email, 
            id: decoded.id,
            role: decoded.role
        }; 

        res.status(200).json({message: `Token verified returning user: ${user}`});

    } catch(error){
        console.log("Error in decoding token :", error);
        res.status(401).json({ message: "Invalid token"});
    }
}