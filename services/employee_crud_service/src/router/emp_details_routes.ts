import { Router } from "express";
import { validateUpdateRequest } from "../middleware/validateUpdate.js";
import { validateEmpStatus } from "../middleware/validateStatus.js";
import { errorHandler } from "../middleware/errorHandler.js";
import { authenticateRequest } from "../middleware/authenticateRequest.js";
import {
  getAllDetails,
  updateDetails,
  updateFlags,
} from "../controller/emp_details_controller.js";

const empDetailRouter = Router();

empDetailRouter.get(
  "/get-all-details",
  getAllDetails
);
empDetailRouter.put(
  "/update-emp-details",
  validateUpdateRequest,
  updateDetails
);
empDetailRouter.put(
  "/update-emp-status",
  validateEmpStatus,
  updateFlags
);
empDetailRouter.put(
  "/ack-policies",
  validateEmpStatus,
  updateFlags
);

export default empDetailRouter;
