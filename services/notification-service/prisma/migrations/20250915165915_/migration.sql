/*
  Warnings:

  - You are about to drop the column `notificationTypeId` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the column `typeName` on the `notification_type` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[type_name]` on the table `notification_type` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `notification_type_id` to the `notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type_name` to the `notification_type` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."notification" DROP CONSTRAINT "notification_notificationTypeId_fkey";

-- DropIndex
DROP INDEX "public"."notification_type_typeName_key";

-- AlterTable
ALTER TABLE "public"."notification" DROP COLUMN "notificationTypeId",
ADD COLUMN     "notification_type_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."notification_type" DROP COLUMN "typeName",
ADD COLUMN     "type_name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "notification_type_type_name_key" ON "public"."notification_type"("type_name");

-- AddForeignKey
ALTER TABLE "public"."notification" ADD CONSTRAINT "notification_notification_type_id_fkey" FOREIGN KEY ("notification_type_id") REFERENCES "public"."notification_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
