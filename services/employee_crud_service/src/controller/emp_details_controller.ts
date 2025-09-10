import type { UpdateEmpSchemaType, GetEmpSchemaType } from "../scehma/details.schema.ts";
import type { Request, Response, NextFunction } from "express";
import {getEmpDetails, updateEmpDetails} from "../repository/emp_details_repository.ts";



export const getAllDetails = async (req: Request, res: Response) => {
  const body: GetEmpSchemaType = req.body as GetEmpSchemaType;

  if(!body.email){
    return res.status(404).json("No input provided");
  }

  try {
    const user = await getEmpDetails(body);

    if(!user){
        return res.status(404).json("No user found");
    }

    return res.status(200).json({
        message: "User found",
        user: user
    })
  } catch (error) {
    console.log(`Error: ${error}`);
    return res.status(500).json("server erorr");
  }
};

export const updateDetails = async (req: Request, res: Response) => {
  
};


export const acknowledgePolicies = async () => {

}

export const deactivateEmp = async () => {
    
}