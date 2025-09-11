import { Router } from "express";
import { validateHR } from "../middleware/validateHR.ts";
import { errorHandler } from "../middleware/errorHandler.ts";
import {
  addEmployeeController,
  terminateEmployeeController,
  getAllEmployeesController,
  addDepartmentController,
  addRoleController,
} from "../controller/hr_crud_controller.ts";

const router = Router();

router.post("/add-employee", validateHR, addEmployeeController);
router.put("/terminate-employee", validateHR, terminateEmployeeController);
router.get("/get-all-employees", getAllEmployeesController);
router.post("/add-department", validateHR, addDepartmentController);
router.post("/add-role", validateHR, addRoleController);

router.use(errorHandler);

export default router;
