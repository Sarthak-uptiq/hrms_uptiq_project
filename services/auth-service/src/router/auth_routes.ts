import {Router} from "express";
import {register, login, verifyToken} from "../controller/auth_controller.ts";
import {validateRequest} from "../middleware/validate_schema.ts";

const router = Router();

router.post("/register", validateRequest, register);
router.post("/login", validateRequest, login);
router.get("/verify-token", verifyToken);

export default router;