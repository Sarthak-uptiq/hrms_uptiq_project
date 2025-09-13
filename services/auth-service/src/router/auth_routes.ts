import {Router} from "express";
import {register, login, verifyToken} from "../controller/auth_controller.ts";
import {validateSchema, validateRegisterSchema} from "../middleware/validate_schema.ts";
import {validateRegister} from "../middleware/validateRegister.ts";

const router = Router();

router.post("/register", validateRegisterSchema, validateRegister, register);
router.post("/login", validateSchema, login);
router.get("/verify-token", verifyToken);

export default router;