/*
  Warnings:

  - A unique constraint covering the columns `[userId,folderId]` on the table `NotificationPreference` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "NotificationPreference_userId_folderId_key" ON "NotificationPreference"("userId", "folderId");
