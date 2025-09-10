-- CreateEnum
CREATE TYPE "public"."Emp_Status" AS ENUM ('ACTIVE', 'INACTIVE', 'TERMINATED');

-- CreateTable
CREATE TABLE "public"."employee" (
    "emp_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "city" TEXT,
    "state" TEXT,
    "pincode" TEXT,
    "dep_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,
    "status" "public"."Emp_Status" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("emp_id")
);

-- CreateTable
CREATE TABLE "public"."department" (
    "dep_id" INTEGER NOT NULL,
    "dep_name" TEXT NOT NULL,

    CONSTRAINT "department_pkey" PRIMARY KEY ("dep_id")
);

-- CreateTable
CREATE TABLE "public"."roles" (
    "role_id" INTEGER NOT NULL,
    "role_name" TEXT NOT NULL,
    "role_ctc" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "public"."documents" (
    "doc_id" SERIAL NOT NULL,
    "doc_type" TEXT NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("doc_id")
);

-- CreateTable
CREATE TABLE "public"."emp_docu_mapping" (
    "id" SERIAL NOT NULL,
    "emp_id" INTEGER NOT NULL,
    "doc_id" INTEGER NOT NULL,
    "doc_url" TEXT NOT NULL,

    CONSTRAINT "emp_docu_mapping_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employee_email_key" ON "public"."employee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "department_dep_name_key" ON "public"."department"("dep_name");

-- CreateIndex
CREATE UNIQUE INDEX "roles_role_name_key" ON "public"."roles"("role_name");

-- CreateIndex
CREATE UNIQUE INDEX "documents_doc_type_key" ON "public"."documents"("doc_type");

-- CreateIndex
CREATE UNIQUE INDEX "emp_docu_mapping_emp_id_doc_id_key" ON "public"."emp_docu_mapping"("emp_id", "doc_id");

-- AddForeignKey
ALTER TABLE "public"."employee" ADD CONSTRAINT "employee_dep_id_fkey" FOREIGN KEY ("dep_id") REFERENCES "public"."department"("dep_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."employee" ADD CONSTRAINT "employee_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."emp_docu_mapping" ADD CONSTRAINT "emp_docu_mapping_emp_id_fkey" FOREIGN KEY ("emp_id") REFERENCES "public"."employee"("emp_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."emp_docu_mapping" ADD CONSTRAINT "emp_docu_mapping_doc_id_fkey" FOREIGN KEY ("doc_id") REFERENCES "public"."documents"("doc_id") ON DELETE RESTRICT ON UPDATE CASCADE;
