import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

// importing auth route for authentication

import authRoutes from "./router/auth_routes.ts"; 

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors({
    origin: "*",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);


app.listen(PORT, () => {
    console.log(`Server running at: ${PORT}`);
});