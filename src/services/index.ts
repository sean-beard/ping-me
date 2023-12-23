import { PrismaClient } from "@prisma/client";
import { PrismaUserRepository } from "@/repositories/PrismaUserRepository";
import { PrismaFileRepository } from "@/repositories/PrismaFileRepository";
import { PrismaFolderRepository } from "@/repositories/PrismaFolderRepository";
import { PrismaNotificationRepository } from "@/repositories/PrismaNotificationRepository";
import { PrismaReminderRepository } from "@/repositories/PrismaReminderRepository";
import { FileService } from "./FileService";
import { FolderService } from "./FolderService";
import { UserService } from "./UserService";
import { NotificationService } from "./NotificationService";
import { ReminderService } from "./ReminderService";

const client = new PrismaClient();

const folderRepository = new PrismaFolderRepository(client);
export const folderService = new FolderService(folderRepository);

const fileRepository = new PrismaFileRepository(client);
export const fileService = new FileService(fileRepository);

const userRepository = new PrismaUserRepository(client);
export const userService = new UserService(userRepository);

const notificationRepository = new PrismaNotificationRepository(client);
export const notificationService = new NotificationService(
  notificationRepository,
);

const reminderRepository = new PrismaReminderRepository(client);
export const reminderService = new ReminderService(reminderRepository);

// attempt to send due reminders every minute
setInterval(() => {
  folderService.sendNotifications();
}, 60000);
