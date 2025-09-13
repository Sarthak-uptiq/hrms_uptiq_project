import type {
  UpdateEmpSchemaType,
  UpdateEmpStatusType,
} from "../scehma/details.schema.ts";
import type { Request, Response, NextFunction } from "express";
import {
  getEmpDetails,
  updateEmpDetails,
  updateAckFlag,
} from "../repository/emp_details_repository.ts";
import jwt from "jsonwebtoken";
import {publicKey} from "../utils.ts";

const getEmailFromToken = (req: Request): string | null => {
  const token = req.cookies.auth_token;

  if(!token){
    return null;
  }

  const decoded: jwt.JwtPayload = jwt.verify(token, publicKey) as jwt.JwtPayload;
  
  return decoded.email;
}

export const getAllDetails = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const email = getEmailFromToken(req);
  
    if(!email){
      return res.status(401).json("Unauthorized: No token provided");
    }

    const user = await getEmpDetails(email);

    if (!user) {
      return res.status(404).json("No user found");
    }

    return res.status(200).json({
      message: "User found",
      user: user,
    });
  } catch (error) {
    console.log(`Error: ${error}`);
    next(error);
  }
};

export const updateDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body: UpdateEmpSchemaType = req.body as UpdateEmpSchemaType;

    const email = getEmailFromToken(req);
  
    if(!email){
      return res.status(401).json("Unauthorized: No token provided");
    } 
    const providedUpdates: Record<string, string> = {};

    Object.entries(body).forEach(([key, value]) => {
      if (value !== undefined)
        providedUpdates[key] = value;
    });

    if (!providedUpdates || providedUpdates === undefined) {
      return res.status(409).json({ meesage: "Noting to update" });
    }

    const user = await updateEmpDetails(email, providedUpdates);

    console.log("User updated successfully", user);

    return res.status(200).json({
      message: "User updated",
      user: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateFlags = async (req: Request, res: Response, next: NextFunction) => {
  const flag_obj = {
    POLICY: "policy_ack_status",
    EMP_STATUS: "status",
  };

  try {
    const body: UpdateEmpStatusType = req.body as UpdateEmpStatusType;

    const email = getEmailFromToken(req);
  
    if(!email){
      return res.status(401).json("Unauthorized: No token provided");
    }

    if (!body) {
      return res.status(404).json("No body found");
    }

    const user = await updateAckFlag(
      flag_obj[body.statusToUpdate],
      body.status_flag,
      email
    );

    return res.status(200).json({
      message: `updated emp status: ${body.statusToUpdate} to ${user}`,
    });
  } catch (error) {
    next(error);
  }
};
