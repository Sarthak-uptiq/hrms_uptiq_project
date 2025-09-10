/*
  Warnings:

  - You are about to drop the `department` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."employee" DROP CONSTRAINT "employee_dep_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."employee" DROP CONSTRAINT "employee_role_id_fkey";

-- DropTable
DROP TABLE "public"."department";

-- DropTable
DROP TABLE "public"."roles";
