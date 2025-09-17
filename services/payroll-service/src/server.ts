import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import router from "./router/router.ts";
import { errorHandler } from "./middleware/errorHandler.ts";
import { bootPayrollConsumer, bootRoleConsumer, connect } from "./utils/bootConsumer.ts";

dotenv.config();

try {
    await connect();
    await bootPayrollConsumer();
    await bootRoleConsumer()
} catch (error) {
    console.log(error);
}

const app = express();
const PORT = process.env.PORT;


app.use(express.json());
app.use(cookieParser());

app.use("/api/payroll", router);
app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`Server running at: ${PORT}`);
});