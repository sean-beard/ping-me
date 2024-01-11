import { describe, expect, it, vi } from "vitest";
import { ReminderService } from "./ReminderService";
import type { PrismaReminderRepository } from "@/repositories/PrismaReminderRepository";

describe(ReminderService.name, () => {
  it("should get reminders", async () => {
    const reminderRepository = {
      getReminders: vi.fn(),
    } as unknown as PrismaReminderRepository;

    const reminderService = new ReminderService(reminderRepository);

    await reminderService.getReminders();

    expect(reminderRepository.getReminders).toBeCalledWith();
  });

  it("should get a reminder", async () => {
    const reminderRepository = {
      getReminder: vi.fn(),
    } as unknown as PrismaReminderRepository;

    const mockFolderId = 1;
    const mockUserId = 1;
    const reminderService = new ReminderService(reminderRepository);

    await reminderService.getReminder(mockFolderId, mockUserId);

    expect(reminderRepository.getReminder).toBeCalledWith(
      mockFolderId,
      mockUserId,
    );
  });

  it("should upsert a reminder", async () => {
    const reminderRepository = {
      upsertReminder: vi.fn(),
    } as unknown as PrismaReminderRepository;

    const mockUserId = 1;
    const mockFolderId = 1;
    const mockSchedule = "schedule";
    const mockDueDate = new Date();
    const reminderService = new ReminderService(reminderRepository);

    await reminderService.upsertReminder({
      userId: mockUserId,
      folderId: mockFolderId,
      schedule: mockSchedule,
      dueDate: mockDueDate,
    });

    expect(reminderRepository.upsertReminder).toBeCalledWith({
      userId: mockUserId,
      folderId: mockFolderId,
      schedule: mockSchedule,
      dueDate: mockDueDate,
    });
  });

  it("should update a reminder due date", async () => {
    const reminderRepository = {
      updateReminderDueDate: vi.fn(),
    } as unknown as PrismaReminderRepository;

    const mockId = 1;
    const mockDueDate = new Date();
    const reminderService = new ReminderService(reminderRepository);

    await reminderService.updateReminderDueDate(mockId, mockDueDate);

    expect(reminderRepository.updateReminderDueDate).toBeCalledWith(
      mockId,
      mockDueDate,
    );
  });

  it("should mark a reminder as completed", async () => {
    const reminderRepository = {
      markReminderAsCompleted: vi.fn(),
    } as unknown as PrismaReminderRepository;

    const mockId = 1;
    const reminderService = new ReminderService(reminderRepository);

    await reminderService.markReminderAsCompleted(mockId);

    expect(reminderRepository.markReminderAsCompleted).toBeCalledWith(mockId);
  });
});
