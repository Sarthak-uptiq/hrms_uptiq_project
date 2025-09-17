import { Router } from "express";
import { authenticateRequest } from "../middleware/authenticate.ts";
import { getPayrollController } from "../controller/payroll_controller.ts";

const router = Router();

router.get("/get-payroll", authenticateRequest, getPayrollController);

export default router;