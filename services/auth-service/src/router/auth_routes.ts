import {Router} from "express";
import {register, login, verifyToken, logout} from "../controller/auth_controller.ts";
import {validateSchema, validateRegisterSchema} from "../middleware/validate_schema.ts";

const router = Router();

router.post("/login", validateSchema, login);
router.get("/verify-token", verifyToken);
router.post("/logout", logout);

export default router;