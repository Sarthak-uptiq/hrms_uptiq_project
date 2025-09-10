/*
  Warnings:

  - Added the required column `policy_ack_status` to the `employee` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Policy_Ack" AS ENUM ('ACK', 'NOT_ACK');

-- AlterTable
ALTER TABLE "public"."employee" ADD COLUMN     "policy_ack_status" "public"."Policy_Ack" NOT NULL;
