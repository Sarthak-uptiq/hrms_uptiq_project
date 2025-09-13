import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import type{ RegisterSchemaType } from "../schema/auth.schema.ts";

const prisma = new PrismaClient();

export const createUser = async (user: RegisterSchemaType, uid: string, password: string) => {
    console.log(password);
    const hashedPass = await bcrypt.hash(password, 10);
    console.log("in create user");
    return prisma.user.create({
            data: {
                email: user.email,
                password: hashedPass,
                authrole: user.role,
                user_id: uid
            }
        });
}

export const findExistingUser = async (email: string) => {
    console.log("in find user");
    return prisma.user.findUnique({
        where: {email}
    });
}

export async function findByUserID(userId: string) {
    return prisma.user.findUnique({
        where: {user_id: userId}
    })
}