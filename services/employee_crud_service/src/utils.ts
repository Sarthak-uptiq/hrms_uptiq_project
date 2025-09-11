import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export enum policy_flag {
  ACK,
  NOT_ACK,
}

export enum status_flag {
  ACTIVE,
  TERMINATE,
  INACTIVE,
}
