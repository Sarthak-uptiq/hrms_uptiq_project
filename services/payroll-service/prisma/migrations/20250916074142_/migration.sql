-- CreateTable
CREATE TABLE "public"."TaxSlab" (
    "id" SERIAL NOT NULL,
    "tax_slab_min" DOUBLE PRECISION NOT NULL,
    "tax_slab_max" DOUBLE PRECISION NOT NULL,
    "deduction_percentage" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "TaxSlab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RolesProjection" (
    "role_id" INTEGER NOT NULL,
    "total_ctc" DOUBLE PRECISION NOT NULL,
    "allowance" DOUBLE PRECISION NOT NULL,
    "bonus" DOUBLE PRECISION NOT NULL,
    "base" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "RolesProjection_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "public"."Payroll" (
    "id" SERIAL NOT NULL,
    "total_employees" INTEGER NOT NULL,
    "gross_amount" DOUBLE PRECISION NOT NULL,
    "net_amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payroll_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TaxSlab_tax_slab_min_key" ON "public"."TaxSlab"("tax_slab_min");

-- CreateIndex
CREATE UNIQUE INDEX "TaxSlab_tax_slab_max_key" ON "public"."TaxSlab"("tax_slab_max");

-- CreateIndex
CREATE UNIQUE INDEX "TaxSlab_deduction_percentage_key" ON "public"."TaxSlab"("deduction_percentage");
