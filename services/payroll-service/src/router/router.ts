import { Router } from "express";
import { authenticateRequest } from "../middleware/authenticate.js";
import { getPayrollController } from "../controller/payroll_controller.js";

const router = Router();

router.get("/get-payroll", authenticateRequest, getPayrollController);

export default router;