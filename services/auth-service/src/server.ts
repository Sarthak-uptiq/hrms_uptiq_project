import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"; // Import cors
import { errorHandler } from "./middleware/errorHandler.ts";
import { userConsumer } from "./utils/rabitMQConfig.ts";


// importing auth route for authentication

import authRoutes from "./router/auth_routes.ts"; 

dotenv.config();

try{
  await userConsumer();  
} catch(err){ 
  console.error("Error inside consumer", err);
}

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: ["http://localhost:8080"], // Frontend origin
  credentials: true,
};

app.use(cors(corsOptions)); // Use cors middleware

app.use("/api/auth", authRoutes);
app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`Server running at: ${PORT}`);
});