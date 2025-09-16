-- CreateTable
CREATE TABLE "public"."notification" (
    "id" SERIAL NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "notificationTypeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notification_type" (
    "id" SERIAL NOT NULL,
    "typeName" TEXT NOT NULL,

    CONSTRAINT "notification_type_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."notification" ADD CONSTRAINT "notification_notificationTypeId_fkey" FOREIGN KEY ("notificationTypeId") REFERENCES "public"."notification_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
