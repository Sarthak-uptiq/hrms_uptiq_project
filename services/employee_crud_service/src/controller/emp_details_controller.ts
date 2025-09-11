import type {
  UpdateEmpSchemaType,
  GetEmpSchemaType,
  UpdateEmpStatusType,
} from "../scehma/details.schema.ts";
import type { Request, Response, NextFunction } from "express";
import {
  getEmpDetails,
  updateEmpDetails,
  updateAckFlag,
} from "../repository/emp_details_repository.ts";

export const getAllDetails = async (req: Request, res: Response, next: NextFunction) => {
  const body: GetEmpSchemaType = req.body as GetEmpSchemaType;

  if (!body.email) {
    return res.status(404).json("No input provided");
  }

  try {
    const user = await getEmpDetails(body);

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

    const email: string = body.existingEmail;
    const providedUpdates: Record<string, string> = {};

    Object.entries(body).forEach(([key, value]) => {
      if (key !== "existingEmail" && value !== undefined)
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

    if (!body) {
      return res.status(404).json("No body found");
    }

    const user = await updateAckFlag(
      flag_obj[body.statusToUpdate],
      body.status_flag,
      body.email
    );

    return res.status(200).json({
      message: `updated emp status: ${body.statusToUpdate} to ${user}`,
    });
  } catch (error) {
    next(error);
  }
};
