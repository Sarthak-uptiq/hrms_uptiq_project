import {Router} from "express";
import {register, login, verifyToken, logout} from "../controller/auth_controller.js";
import {validateSchema, validateRegisterSchema} from "../middleware/validate_schema.js";

const router = Router();

router.post("/login", validateSchema, login);
router.get("/verify-token", verifyToken);
router.post("/logout", logout);

export default router;