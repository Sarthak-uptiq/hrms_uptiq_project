/*
  Warnings:

  - A unique constraint covering the columns `[typeName]` on the table `notification_type` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "notification_type_typeName_key" ON "public"."notification_type"("typeName");
