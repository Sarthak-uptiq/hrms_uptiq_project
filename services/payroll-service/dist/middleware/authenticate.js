import jwt from "jsonwebtoken";
import { publicKey } from "../utils/helper.js";
export function authenticateRequest(req, res, next) {
    try {
        const token = req.cookies.auth_token;
        if (!token) {
            return res.status(401).json({ error: "Authorization token missing" });
        }
        const decoded = jwt.verify(token, publicKey);
        if (!decoded || !decoded.email) {
            return res.status(401).json({ error: "Invalid token" });
        }
        const role = decoded.role;
        if (!role || role !== "HR") {
            return res.status(401).json({ error: "Unathorized : Not an HR" });
        }
        next();
    }
    catch (error) {
        next(error);
    }
}
