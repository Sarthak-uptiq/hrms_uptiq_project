import {Router} from "express";
import {register, login, verifyToken, logout} from "../controller/auth_controller.ts";
import {validateSchema, validateRegisterSchema} from "../middleware/validate_schema.ts";
import {validateHRRequests} from "../middleware/validateRegister.ts";

const router = Router();

router.post("/register", validateRegisterSchema, validateHRRequests, register);
router.post("/login", validateSchema, login);
router.get("/verify-token", verifyToken);
router.post("/logout", logout);

export default router;