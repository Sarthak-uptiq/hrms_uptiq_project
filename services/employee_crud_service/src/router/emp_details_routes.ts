import { Router } from "express";
import { validateUpdateRequest } from "../middleware/validateUpdate.ts";
import { validateEmpStatus } from "../middleware/validateStatus.ts";
import { errorHandler } from "../middleware/errorHandler.ts";
import { authenticateRequest } from "../middleware/authenticateRequest.ts";
import {
  getAllDetails,
  updateDetails,
  updateFlags,
} from "../controller/emp_details_controller.ts";

const empDetailRouter = Router();

empDetailRouter.get(
  "/get-all-details",
  authenticateRequest,
  getAllDetails,
  errorHandler
);
empDetailRouter.put(
  "/update-emp-details",
  authenticateRequest,
  validateUpdateRequest,
  updateDetails, 
  errorHandler
);
empDetailRouter.put(
  "/update-emp-status",
  authenticateRequest,
  validateEmpStatus,
  updateFlags,
  errorHandler
);
empDetailRouter.put(
  "/ack-policies",
  authenticateRequest,
  validateEmpStatus,
  updateFlags,
  errorHandler
);

export default empDetailRouter;
