import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import empDetailsRouter from "./router/emp_details_routes.ts";
import empDocsRouter from "./router/emp_docs_routes.ts";
import empRagRouter from "./router/rag_routes.ts";

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

app.use("/api/emp/detials", empDetailsRouter);
app.use("/api/emp/docs", empDocsRouter);
app.use("/api/emp/rag", empRagRouter);

app.listen(PORT, () => {
  console.log("Emp service listening on port: ", PORT);
});
