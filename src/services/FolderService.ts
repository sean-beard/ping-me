import webpush from "web-push";
import parser from "cron-parser";
import { PrismaFolderRepository } from "@/repositories/PrismaFolderRepository";
import type {
  File,
  Folder,
  NotificationPreference,
  NotificationRepeat,
} from "./types";
import { notificationService, reminderService } from ".";

type FolderRepository = PrismaFolderRepository;

export class FolderService {
  constructor(private folderRepository: FolderRepository) {}

  async getFolders(userId: number): Promise<Folder[] | null> {
    const folders = await this.folderRepository.getFolders(userId);

    return folders;
  }

  async getFolder(folderId: number, userId: number): Promise<Folder | null> {
    const folder = await this.folderRepository.getFolder(folderId);

    if (!folder) {
      console.log("Folder with ID: " + folderId + " does not exist");
      return null;
    }

    if (folder?.userId !== userId) {
      console.log(`User ${userId} does not own folder with ID: ${folderId}`);
      return null;
    }

    return folder;
  }

  async createFolder(
    folderName: string,
    userId: number,
  ): Promise<Folder | null> {
    const folder = await this.folderRepository.createFolder(folderName, userId);

    return folder;
  }

  async updateFolder(
    folderId: number,
    folder: Partial<Folder>,
    userId: number,
  ): Promise<Folder | null> {
    const isFolderOwnershipValid = await this.isFolderOwnershipValid(
      folderId,
      userId,
    );

    if (!isFolderOwnershipValid) {
      return null;
    }

    const updatedFolder = await this.folderRepository.updateFolder(
      folderId,
      folder,
    );

    return updatedFolder;
  }

  async addFiles(
    folderId: number,
    files: File[],
    userId: number,
  ): Promise<Folder | null> {
    const isFolderOwnershipValid = await this.isFolderOwnershipValid(
      folderId,
      userId,
    );

    if (!isFolderOwnershipValid) {
      console.log(`User ${userId} does not own folder with ID: ${folderId}`);
      return null;
    }

    const updatedFolder = await this.folderRepository.addFiles(folderId, files);

    return updatedFolder;
  }

  async getFiles(folderId: number, userId: number): Promise<File[] | null> {
    const isFolderOwnershipValid = await this.isFolderOwnershipValid(
      folderId,
      userId,
    );

    if (!isFolderOwnershipValid) {
      console.log(`User ${userId} does not own folder with ID: ${folderId}`);
      return null;
    }

    const files = await this.folderRepository.getFiles(folderId);

    return files;
  }

  async deleteFolder(folderId: number, userId: number): Promise<number | null> {
    const isFolderOwnershipValid = await this.isFolderOwnershipValid(
      folderId,
      userId,
    );

    if (!isFolderOwnershipValid) {
      console.log(`User ${userId} does not own folder with ID: ${folderId}`);
      return null;
    }

    const deletedFolderId = await this.folderRepository.deleteFolder(folderId);

    return deletedFolderId;
  }

  async deleteFiles(
    folderId: number,
    fileIds: number[],
    userId: number,
  ): Promise<Folder | null> {
    const isFolderOwnershipValid = await this.isFolderOwnershipValid(
      folderId,
      userId,
    );

    if (!isFolderOwnershipValid) {
      return null;
    }

    const updatedFolder = await this.folderRepository.deleteFiles(
      folderId,
      fileIds,
    );

    return updatedFolder;
  }

  async getNotificationPreference(
    folderId: number,
    userId: number,
  ): Promise<NotificationPreference> {
    const isFolderOwnershipValid = await this.isFolderOwnershipValid(
      folderId,
      userId,
    );

    if (!isFolderOwnershipValid) {
      console.log("Returning default notification preference");

      return {
        date: "",
        time: "",
        repeat: {
          sunday: false,
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
        },
      };
    }

    const reminder = await reminderService.getReminder(folderId, userId);

    if (!reminder) {
      console.error(
        `Error getting notification preference for user ${userId} and folder ${folderId}`,
      );
      return {
        date: "",
        time: "",
        repeat: {
          sunday: false,
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
        },
      };
    }

    const reminderDueDateUtcString = reminder.dueDate.toISOString();
    const repeat = this.getNotificationRepeat(reminder.schedule);

    return {
      date: reminderDueDateUtcString?.slice(0, 10) ?? "",
      time: reminderDueDateUtcString?.slice(11, 16) ?? "",
      repeat,
    };
  }

  private getNotificationRepeat(schedule: string | null): NotificationRepeat {
    if (!schedule) {
      return {
        sunday: false,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
      };
    }

    const hasMultipleDays = schedule.indexOf(",") !== -1;

    if (hasMultipleDays) {
      const parts = schedule.split(" ");
      const days = parts[parts.length - 1].split(",");

      return {
        sunday: days.includes("0"),
        monday: days.includes("1"),
        tuesday: days.includes("2"),
        wednesday: days.includes("3"),
        thursday: days.includes("4"),
        friday: days.includes("5"),
        saturday: days.includes("6"),
      };
    }

    const lastFiveCharacters = schedule.slice(-5);
    const isDaily = schedule.slice(-3) === "* *";

    return {
      sunday: lastFiveCharacters === "* * 0" || isDaily,
      monday: lastFiveCharacters === "* * 1" || isDaily,
      tuesday: lastFiveCharacters === "* * 2" || isDaily,
      wednesday: lastFiveCharacters === "* * 3" || isDaily,
      thursday: lastFiveCharacters === "* * 4" || isDaily,
      friday: lastFiveCharacters === "* * 5" || isDaily,
      saturday: lastFiveCharacters === "* * 6" || isDaily,
    };
  }

  private getCronSchedule(
    notificationPreference: NotificationPreference,
  ): string | null {
    const daysOfWeek: (keyof typeof notificationPreference.repeat)[] = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    const selectedDays = daysOfWeek
      .filter((day) => notificationPreference.repeat[day])
      .map((day) => daysOfWeek.indexOf(day))
      .join(",");

    if (selectedDays === "") {
      return null;
    }

    const time = notificationPreference.time.split(":");
    const hours = time[0];
    const minutes = time[1];

    return `${minutes} ${hours} * * ${selectedDays}`;
  }

  async setNotificationPreference(
    userId: number,
    folderId: number,
    notificationPreference: NotificationPreference,
  ): Promise<boolean | null> {
    const isFolderOwnershipValid = await this.isFolderOwnershipValid(
      folderId,
      userId,
    );

    if (!isFolderOwnershipValid) {
      return null;
    }

    const schedule = this.getCronSchedule(notificationPreference);
    const dueDateInUtc = new Date(
      `${notificationPreference.date}T${notificationPreference.time}:00Z`,
    );

    const success = await reminderService.upsertReminder({
      userId,
      folderId,
      schedule,
      dueDate: dueDateInUtc,
    });

    return success;
  }

  async getRandomFile(folderId: number, userId: number): Promise<File | null> {
    const isFolderOwnershipValid = await this.isFolderOwnershipValid(
      folderId,
      userId,
    );

    if (!isFolderOwnershipValid) {
      return null;
    }

    const files = await this.folderRepository.getFiles(folderId);

    if (!files) {
      return null;
    }

    return files[Math.floor(Math.random() * files.length)];
  }

  async sendNotifications(): Promise<void> {
    try {
      const dueReminders = await reminderService.getReminders();

      if (!dueReminders) {
        return;
      }

      for (const reminder of dueReminders) {
        const { notificationsEnabled } = reminder;

        if (notificationsEnabled) {
          const notificationsToSend =
            await notificationService.createNotificationsToSend(reminder);

          if (!notificationsToSend) {
            console.error(
              `Error getting notifications to send for folder ${reminder.id}`,
            );
            continue;
          }

          if (notificationsToSend.length === 0) {
            console.log(`No notifications to send for folder ${reminder.id}`);
            continue;
          }

          const file = await this.getRandomFile(
            reminder.folderId,
            reminder.userId,
          );

          if (!file) {
            console.error(
              `Error getting random file for folder ${reminder.folderId}`,
            );
            continue;
          }

          for (const notificationToSend of notificationsToSend) {
            const pushSubscription = {
              endpoint: notificationToSend.subscription.endpoint,
              keys: {
                auth: notificationToSend.subscription.auth,
                p256dh: notificationToSend.subscription.p256dh,
              },
            };

            try {
              webpush.setVapidDetails(
                "https://github.com/sean-beard/ping-me/",
                process.env.VAPID_PUBLIC_KEY ?? "",
                process.env.VAPID_PRIVATE_KEY ?? "",
              );

              await webpush.sendNotification(
                pushSubscription,
                JSON.stringify({
                  title: "PingMe",
                  body: file.name,
                  url: `${notificationToSend.subscription.origin}/file/${file.id}`,
                  reminderId: reminder.id,
                  origin: notificationToSend.subscription.origin,
                }),
              );
            } catch (error) {
              console.error(
                `Error sending notification for reminder ${reminder.id}, folder ${reminder.folderId}, file ${file.id} and notification ${notificationToSend.id}`,
                error,
              );
              continue;
            }

            // Update the notification status in the database
            await notificationService.updateNotification(
              notificationToSend.id,
              { isNotified: true },
            );

            // TODO: test this
            if (reminder.schedule && reminder.schedule !== "null") {
              const nextDueDate = this.getNextDueDate(
                reminder.dueDate,
                reminder.schedule,
              );

              await reminderService.updateReminderDueDate(
                reminder.id,
                nextDueDate,
              );
            } else {
              await reminderService.markReminderAsCompleted(reminder.id);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error processing reminders:", error);
    }
  }

  private getNextDueDate(currentDueDate: Date, cronSchedule: string): Date {
    if (!cronSchedule) {
      return currentDueDate;
    }

    const interval = parser.parseExpression(cronSchedule, {
      startDate: currentDueDate,
      tz: "UTC",
    });

    return interval.next().toDate();
  }

  private async isFolderOwnershipValid(
    folderId: number,
    userId: number,
  ): Promise<boolean> {
    try {
      const folder = await this.getFolder(folderId, userId);

      if (!folder) {
        console.log(`Folder with ID: ${folderId} could not be found`);
        return false;
      }

      if (folder?.userId !== userId) {
        console.log(`User ${userId} does not own folder with ID: ${folderId}`);
        return false;
      }

      return true;
    } catch {
      console.error("Error finding folder with ID: " + folderId);
      return false;
    }
  }
}
