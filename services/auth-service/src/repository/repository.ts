import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import type{ UserInput } from "../schema/auth.schema.ts";

const prisma = new PrismaClient();

export const createUser = async (user: UserInput) => {
    const hashedPass = await bcrypt.hash(user.password, 10);
    console.log("in create user");
    return prisma.user.create({
            data: {
                email: user.email,
                password: hashedPass,
                authrole: user.role
            }
        });
}

export const findExistingUser = async (email: string) => {
    console.log("in find user");
    return prisma.user.findUnique({
        where: {email}
    });
}