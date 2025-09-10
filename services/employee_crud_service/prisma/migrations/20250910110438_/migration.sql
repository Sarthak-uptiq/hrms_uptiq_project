/*
  Warnings:

  - The primary key for the `employee` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."emp_docu_mapping" DROP CONSTRAINT "emp_docu_mapping_emp_id_fkey";

-- AlterTable
ALTER TABLE "public"."emp_docu_mapping" ALTER COLUMN "emp_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."employee" DROP CONSTRAINT "employee_pkey",
ALTER COLUMN "emp_id" DROP DEFAULT,
ALTER COLUMN "emp_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "employee_pkey" PRIMARY KEY ("emp_id");
DROP SEQUENCE "employee_emp_id_seq";

-- AddForeignKey
ALTER TABLE "public"."emp_docu_mapping" ADD CONSTRAINT "emp_docu_mapping_emp_id_fkey" FOREIGN KEY ("emp_id") REFERENCES "public"."employee"("emp_id") ON DELETE RESTRICT ON UPDATE CASCADE;
