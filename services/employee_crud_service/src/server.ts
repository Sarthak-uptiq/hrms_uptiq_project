import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import empDetailsRouter from "./router/emp_details_routes.js";
import empDocsRouter from "./router/emp_docs_routes.js";
import hrCrudRoutes from "./router/hr_crud_routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { boot } from "./utils/bootConnection.js";
import { authenticateRequest } from "./middleware/authenticateRequest.js";

dotenv.config();

try {
  await boot();
} catch (err) {
  console.error("Failed to connect to RabbitMQ", err);
}

const PORT = process.env.PORT;
const app = express();

app.use(express.json());

app.use(cookieParser());
app.use(authenticateRequest);

app.use("/api/emp/details", empDetailsRouter);
app.use("/api/emp/docs", empDocsRouter);
app.use("/api/hr", hrCrudRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Emp service listening on port: ", PORT);
});
