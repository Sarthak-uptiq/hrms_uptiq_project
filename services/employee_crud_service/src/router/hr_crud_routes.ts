import { Router } from "express";
import { validateHR } from "../middleware/validateHR.ts";
import { errorHandler } from "../middleware/errorHandler.ts";
import { authenticateRequest } from "../middleware/authenticateRequest.ts";
import {
  addEmployeeController,
  terminateEmployeeController,
  getAllEmployeesController,
  addDepartmentController,
  addRoleController,
  getAllDepartmentsController,
  getAllRolesController,
  getRoleInfoController,
  editRoleController,
  editDepartmentController,
} from "../controller/hr_crud_controller.ts";

const router = Router();

router.post("/add-employee", authenticateRequest, validateHR, addEmployeeController);
router.put("/terminate-employee", authenticateRequest, validateHR, terminateEmployeeController);
router.get("/get-all-employees", authenticateRequest, validateHR, getAllEmployeesController);
router.post("/add-department", authenticateRequest, validateHR, addDepartmentController);
router.post("/add-role", authenticateRequest, validateHR, addRoleController);
router.get("/get-all-departments", authenticateRequest, validateHR, getAllDepartmentsController);
router.get("/get-all-roles", authenticateRequest, validateHR, getAllRolesController);
router.get("/get-role-info/:role_id", authenticateRequest, validateHR, getRoleInfoController);
router.put("/edit-role/:role_id", authenticateRequest, validateHR, editRoleController);
router.put("/edit-department/:dep_id", authenticateRequest, validateHR, editDepartmentController);
router.use(errorHandler);

export default router;
