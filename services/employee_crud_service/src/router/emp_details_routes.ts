import { Router } from "express";
import { validateGetRequest } from "../middleware/validateGet.ts";
import { validateUpdateRequest } from "../middleware/validateUpdate.ts";
import { authenticateRequest } from "../middleware/authenticate.ts";
import { validateEmpStatus } from "../middleware/validateStatus.ts";
import {
  getAllDetails,
  updateDetails,
  updateFlags,
} from "../controller/emp_details_controller.ts";

const empDetailRouter = Router();

empDetailRouter.get(
  "/get-all-details",
  authenticateRequest,
  validateGetRequest,
  getAllDetails
);
empDetailRouter.put(
  "/update-emp-details",
  authenticateRequest,
  validateUpdateRequest,
  updateDetails
);
empDetailRouter.put(
  "/update-emp-status",
  authenticateRequest,
  validateEmpStatus,
  updateFlags
);
empDetailRouter.put(
  "/ack-policies",
  authenticateRequest,
  validateEmpStatus,
  updateFlags
);

export default empDetailRouter;
