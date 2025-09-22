import { Router } from "express";
import { validateHR } from "../middleware/validateHR.js";
import { errorHandler } from "../middleware/errorHandler.js";
import { authenticateRequest } from "../middleware/authenticateRequest.js";
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
  initiaPayrollController,
} from "../controller/hr_crud_controller.js";

const router = Router();


router.post("/add-employee", validateHR, addEmployeeController);
router.put("/terminate-employee", validateHR, terminateEmployeeController);
router.get("/get-all-employees", validateHR, getAllEmployeesController);
router.post("/add-department", validateHR, addDepartmentController);
router.post("/add-role", validateHR, addRoleController);
router.get("/get-all-departments", validateHR, getAllDepartmentsController);
router.get("/get-all-roles", validateHR, getAllRolesController);
router.get("/get-role-info/:role_id", validateHR, getRoleInfoController);
router.put("/edit-role/:role_id", validateHR, editRoleController);
router.put("/edit-department/:dep_id", validateHR, editDepartmentController);
router.get("/initiate-payroll", initiaPayrollController);

export default router;
