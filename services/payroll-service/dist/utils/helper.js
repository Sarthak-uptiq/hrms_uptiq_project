import { PrismaClient } from "@prisma/client";
import fs from "fs";
export const publicKey = fs.readFileSync("public.pem", "utf-8");
export const prisma = new PrismaClient();
