/*
  Warnings:

  - The values [ACK,NOT_ACK] on the enum `Policy_Ack` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."Policy_Ack_new" AS ENUM ('ACKNOWLEDGED', 'PENDING');
ALTER TABLE "public"."employee" ALTER COLUMN "policy_ack_status" TYPE "public"."Policy_Ack_new" USING ("policy_ack_status"::text::"public"."Policy_Ack_new");
ALTER TYPE "public"."Policy_Ack" RENAME TO "Policy_Ack_old";
ALTER TYPE "public"."Policy_Ack_new" RENAME TO "Policy_Ack";
DROP TYPE "public"."Policy_Ack_old";
COMMIT;
