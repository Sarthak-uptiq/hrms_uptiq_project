/*
  Warnings:

  - The values [CANDIDATE] on the enum `AuthRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."AuthRole_new" AS ENUM ('ADMIN', 'HR', 'EMPLOYEE');
ALTER TABLE "public"."User" ALTER COLUMN "authrole" TYPE "public"."AuthRole_new" USING ("authrole"::text::"public"."AuthRole_new");
ALTER TYPE "public"."AuthRole" RENAME TO "AuthRole_old";
ALTER TYPE "public"."AuthRole_new" RENAME TO "AuthRole";
DROP TYPE "public"."AuthRole_old";
COMMIT;
