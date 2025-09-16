import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler.ts";
import { notificationConsumer } from "./consumer/notificationConsumer.ts";

dotenv.config();

try{
  await notificationConsumer();  
} catch(err){ 
  console.error("Error inside consumer", err);
}

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`Server running at: ${PORT}`);
});