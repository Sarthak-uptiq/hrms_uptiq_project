import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import empDetailsRouter from "./router/emp_details_routes.ts";
import empDocsRouter from "./router/emp_docs_routes.ts";
import hrCrudRoutes from "./router/hr_crud_routes.ts";
import { errorHandler } from "./middleware/errorHandler.ts";

dotenv.config();

const PORT = process.env.PORT;
const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());

app.use(cookieParser());

app.use("/api/emp/details", empDetailsRouter);
app.use("/api/emp/docs", empDocsRouter);
app.use("/api/hr", hrCrudRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Emp service listening on port: ", PORT);
});
