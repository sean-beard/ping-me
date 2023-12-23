import type { PrismaClient } from "@prisma/client";

export interface DatabaseReminder {
  id: number;
  dueDate: Date;
  schedule: string | "null";
  folderId: number;
  userId: number;
  notificationsEnabled: 0 | 1;
}

export class PrismaReminderRepository {
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  async getReminder(
    folderId: number,
    userId: number,
  ): Promise<{ dueDate: Date; schedule: string | null } | null> {
    try {
      const sql = `
          SELECT
            dueDate,
            schedule
          FROM
            "Reminder"
          WHERE
            userId = ${userId}
            AND folderId = ${folderId}
          `;

      const rawReminders: {
        dueDate: Date;
        schedule: string | null;
      }[] = await this.client.$queryRawUnsafe(sql);

      return rawReminders[0] ?? null;
    } catch (error) {
      console.error(
        `Error getting notification preference for user ${userId} and folder ${folderId}`,
        error,
      );
      return null;
    }
  }

  async upsertReminder({
    userId,
    folderId,
    schedule,
    dueDate,
  }: {
    userId: number;
    folderId: number;
    schedule: string | null;
    dueDate: Date;
  }): Promise<boolean | null> {
    try {
      const formattedDate = this.getFormattedDate(dueDate);

      const sql = `
          INSERT INTO "Reminder" (dueDate, schedule, userId, folderId, endDate, isCompleted)
          VALUES (DATETIME('${formattedDate}'), '${schedule}', ${userId}, ${folderId}, NULL, 0)
          ON CONFLICT (userId, folderId) DO UPDATE SET dueDate = DATETIME('${formattedDate}'), schedule = '${schedule}', isCompleted = 0
          `;

      await this.client.$executeRawUnsafe(sql);

      return true;
    } catch (error) {
      console.error(
        `Error upserting notification preference for user ${userId} and folder ${folderId}`,
        error,
      );
      return null;
    }
  }

  async updateReminderDueDate(
    id: number,
    dueDate: Date,
  ): Promise<DatabaseReminder | null> {
    try {
      const formattedDate = this.getFormattedDate(dueDate);

      const sql = `
          UPDATE "Reminder"
          SET dueDate = DATETIME('${formattedDate}')
          WHERE id = ${id}
          `;

      await this.client.$executeRawUnsafe(sql);

      return null;
    } catch (error) {
      console.error("Error updating reminder due date", error);
      return null;
    }
  }

  async markReminderAsCompleted(id: number): Promise<boolean | null> {
    try {
      await this.client.reminder.update({
        where: { id },
        data: { isCompleted: true },
      });

      return true;
    } catch (error) {
      console.error("Error marking reminder as completed", error);
      return null;
    }
  }

  async getReminders(): Promise<DatabaseReminder[] | null> {
    try {
      // Need to go with raw SQL because Prisma doesn't return the correct date...
      // https://github.com/prisma/prisma/issues/20615
      // TODO: sanitize SQL
      const sql = `
          SELECT
            r.id,
            r.dueDate,
            r.schedule,
            r.folderId,
            r.userId,
            u.notificationsEnabled
          FROM
            "Reminder" r
          JOIN User u ON r.userId = u.id
          WHERE
            r.dueDate <= DATETIME ('NOW')
            AND r.isCompleted = 0
          `;

      return this.client.$queryRawUnsafe(sql);
    } catch (error) {
      console.error("Error getting due reminders", error);
      return null;
    }
  }

  private getFormattedDate(date: Date): string {
    const month = `${date.getUTCMonth() + 1 < 10 ? "0" : ""}${
      date.getUTCMonth() + 1
    }`;
    const day = `${date.getUTCDate() < 10 ? "0" : ""}${date.getUTCDate()}`;

    const yearMonthDay = `${date.getUTCFullYear()}-${month}-${day}`;

    const hours = `${date.getUTCHours() < 10 ? "0" : ""}${date.getUTCHours()}`;
    const minutes = `${
      date.getUTCMinutes() < 10 ? "0" : ""
    }${date.getUTCMinutes()}`;
    const seconds = `${
      date.getUTCSeconds() < 10 ? "0" : ""
    }${date.getUTCSeconds()}`;

    const formattedDate = `${yearMonthDay} ${hours}:${minutes}:${seconds}`;

    return formattedDate;
  }
}
