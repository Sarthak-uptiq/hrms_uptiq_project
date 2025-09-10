import {Router} from "express";
import {validateGetRequest} from "../middleware/validateGet.ts";
import { validateUpdateRequest } from "../middleware/validateUpdate.ts";
import {authenticateRequest} from "../middleware/authenticate.ts";
import {getAllDetails, updateDetails, acknowledgePolicies, deactivateEmp} from "../controller/emp_details_controller.ts";


const empDetailRouter = Router();

empDetailRouter.get("/get-all-detials", authenticateRequest, validateGetRequest, getAllDetails);
empDetailRouter.put("/update-emp-details", authenticateRequest, validateUpdateRequest, updateDetails);
empDetailRouter.put("/deactivate-emp", authenticateRequest, deactivateEmp);
empDetailRouter.put("/ack-policies", authenticateRequest, acknowledgePolicies);

export default empDetailRouter;