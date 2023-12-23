/*
  Warnings:

  - You are about to drop the `NotificationPreference` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "NotificationPreference_userId_folderId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "NotificationPreference";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Reminder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "folderId" INTEGER NOT NULL,
    "dueDate" DATETIME NOT NULL,
    "schedule" TEXT,
    "endDate" DATETIME,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Reminder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reminder_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reminderId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "subscriptionId" INTEGER NOT NULL,
    "isNotified" BOOLEAN NOT NULL DEFAULT false,
    "notificationDatetime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Notification_reminderId_fkey" FOREIGN KEY ("reminderId") REFERENCES "Reminder" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Notification_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "NotificationSubscription" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "NotificationSubscription" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "expirationTime" DATETIME,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "NotificationSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "notificationsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT,
    "firstName" TEXT,
    "lastName" TEXT
);
INSERT INTO "new_User" ("email", "firstName", "id", "lastName", "username") SELECT "email", "firstName", "id", "lastName", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Reminder_userId_folderId_key" ON "Reminder"("userId", "folderId");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationSubscription_userId_endpoint_key" ON "NotificationSubscription"("userId", "endpoint");
