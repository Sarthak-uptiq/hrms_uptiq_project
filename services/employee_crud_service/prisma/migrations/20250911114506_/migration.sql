-- CreateTable
CREATE TABLE "public"."department" (
    "dep_id" SERIAL NOT NULL,
    "dep_name" TEXT NOT NULL,

    CONSTRAINT "department_pkey" PRIMARY KEY ("dep_id")
);

-- CreateTable
CREATE TABLE "public"."role" (
    "role_id" SERIAL NOT NULL,
    "role_name" TEXT NOT NULL,
    "total_ctc" DOUBLE PRECISION NOT NULL,
    "base_salary" DOUBLE PRECISION NOT NULL,
    "bonus" DOUBLE PRECISION NOT NULL,
    "allowance" DOUBLE PRECISION NOT NULL,
    "tax_id" INTEGER NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("role_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "department_dep_name_key" ON "public"."department"("dep_name");

-- CreateIndex
CREATE UNIQUE INDEX "role_role_name_key" ON "public"."role"("role_name");

-- AddForeignKey
ALTER TABLE "public"."employee" ADD CONSTRAINT "employee_dep_id_fkey" FOREIGN KEY ("dep_id") REFERENCES "public"."department"("dep_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."employee" ADD CONSTRAINT "employee_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."role"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;
