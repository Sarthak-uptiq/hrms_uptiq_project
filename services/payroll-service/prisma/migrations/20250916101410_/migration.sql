/*
  Warnings:

  - A unique constraint covering the columns `[role_name]` on the table `RolesProjection` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `role_name` to the `RolesProjection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."RolesProjection" ADD COLUMN     "role_name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RolesProjection_role_name_key" ON "public"."RolesProjection"("role_name");
