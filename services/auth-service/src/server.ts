import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler.ts";

// importing auth route for authentication

import authRoutes from "./router/auth_routes.ts"; 

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`Server running at: ${PORT}`);
});