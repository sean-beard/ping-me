import { describe, expect, it, vi } from "vitest";
import { PrismaReminderRepository } from "./PrismaReminderRepository";
import type { PrismaClient } from "@prisma/client";

describe(PrismaReminderRepository.name, () => {
  const mockUserId = 1;
  const mockFolderId = 2;
  const mockSchedule = "* * * * *";
  const mockReminderId = 10;

  describe("getReminder", () => {
    it("should get a reminder", async () => {
      const client = {
        $queryRawUnsafe: vi.fn().mockResolvedValue([
          {
            dueDate: new Date(),
            schedule: mockSchedule,
          },
        ]),
      } as unknown as PrismaClient;

      const reminderRepository = new PrismaReminderRepository(client);

      const reminder = await reminderRepository.getReminder(
        mockFolderId,
        mockUserId,
      );

      expect(reminder).toEqual({
        schedule: mockSchedule,
        dueDate: expect.any(Date),
      });
    });

    it("should return null if reminder is not found", async () => {
      const client = {
        $queryRawUnsafe: vi.fn().mockResolvedValue([]),
      } as unknown as PrismaClient;

      const reminderRepository = new PrismaReminderRepository(client);

      const reminder = await reminderRepository.getReminder(
        mockFolderId,
        mockUserId,
      );

      expect(reminder).toBeNull();
    });

    it("should handle errors", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error");

      const client = {
        $queryRawUnsafe: vi.fn().mockRejectedValue(new Error("error")),
      } as unknown as PrismaClient;

      const reminderRepository = new PrismaReminderRepository(client);

      const reminder = await reminderRepository.getReminder(
        mockFolderId,
        mockUserId,
      );

      expect(reminder).toBeNull();
      expect(consoleErrorSpy).toBeCalledWith({
        message: `Error getting reminder`,
        userId: mockUserId,
        folderId: mockFolderId,
        error: new Error("error"),
      });
    });
  });

  describe("upsertReminder", () => {
    const mockDueDate = new Date();

    it("should upsert a reminder", async () => {
      const client = {
        $executeRawUnsafe: vi.fn().mockResolvedValue([]),
      } as unknown as PrismaClient;

      const reminderRepository = new PrismaReminderRepository(client);

      const result = await reminderRepository.upsertReminder({
        userId: mockUserId,
        folderId: mockFolderId,
        schedule: mockSchedule,
        dueDate: mockDueDate,
      });

      expect(result).toBe(true);
    });

    it("should handle errors", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error");

      const client = {
        $executeRawUnsafe: vi.fn().mockRejectedValue(new Error("error")),
      } as unknown as PrismaClient;

      const reminderRepository = new PrismaReminderRepository(client);

      const result = await reminderRepository.upsertReminder({
        userId: mockUserId,
        folderId: mockFolderId,
        schedule: mockSchedule,
        dueDate: mockDueDate,
      });

      expect(result).toBeNull();
      expect(consoleErrorSpy).toBeCalledWith({
        message: `Error upserting reminder`,
        userId: mockUserId,
        folderId: mockFolderId,
        schedule: mockSchedule,
        dueDate: mockDueDate,
        error: new Error("error"),
      });
    });
  });

  describe("updateReminderDueDate", () => {
    const mockDueDate = new Date();

    it("should update a reminder due date", async () => {
      const client = {
        $executeRawUnsafe: vi.fn().mockResolvedValue([]),
      } as unknown as PrismaClient;

      const reminderRepository = new PrismaReminderRepository(client);

      const result = await reminderRepository.updateReminderDueDate(
        mockReminderId,
        mockDueDate,
      );

      expect(result).toBe(true);
    });

    it("should handle errors", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error");

      const client = {
        $executeRawUnsafe: vi.fn().mockRejectedValue(new Error("error")),
      } as unknown as PrismaClient;

      const reminderRepository = new PrismaReminderRepository(client);

      const result = await reminderRepository.updateReminderDueDate(
        mockReminderId,
        mockDueDate,
      );

      expect(result).toBeNull();
      expect(consoleErrorSpy).toBeCalledWith({
        message: `Error updating reminder due date`,
        reminderId: mockReminderId,
        dueDate: mockDueDate,
        error: new Error("error"),
      });
    });
  });

  describe("markReminderAsCompleted", () => {
    it("should mark a reminder as completed", async () => {
      const client = {
        reminder: {
          update: vi.fn().mockResolvedValue([]),
        },
      } as unknown as PrismaClient;

      const reminderRepository = new PrismaReminderRepository(client);

      const result = await reminderRepository.markReminderAsCompleted(
        mockReminderId,
      );

      expect(result).toBe(true);
    });

    it("should handle errors", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error");

      const client = {
        reminder: {
          update: vi.fn().mockRejectedValue(new Error("error")),
        },
      } as unknown as PrismaClient;

      const reminderRepository = new PrismaReminderRepository(client);

      const result = await reminderRepository.markReminderAsCompleted(
        mockReminderId,
      );

      expect(result).toBeNull();
      expect(consoleErrorSpy).toBeCalledWith({
        message: `Error marking reminder as completed`,
        reminderId: mockReminderId,
        error: new Error("error"),
      });
    });
  });

  describe("getReminders", () => {
    it("should get reminders", async () => {
      const mockReminders = [
        {
          id: mockReminderId,
          dueDate: new Date(),
          schedule: mockSchedule,
          folderId: mockFolderId,
          userId: mockUserId,
          notificationsEnabled: 1,
        },
      ];
      const client = {
        $queryRawUnsafe: vi.fn().mockResolvedValue(mockReminders),
      } as unknown as PrismaClient;

      const reminderRepository = new PrismaReminderRepository(client);

      const result = await reminderRepository.getReminders();

      expect(result).toEqual(mockReminders);
    });

    it("should handle errors", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error");

      const client = {
        $queryRawUnsafe: vi.fn().mockImplementation(() => {
          throw new Error("error");
        }),
      } as unknown as PrismaClient;

      const reminderRepository = new PrismaReminderRepository(client);

      const result = await reminderRepository.getReminders();

      expect(result).toBeNull();
      expect(consoleErrorSpy).toBeCalledWith({
        message: `Error getting due reminders`,
        error: new Error("error"),
      });
    });
  });
});
