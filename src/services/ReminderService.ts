import type {
  DatabaseReminder,
  PrismaReminderRepository,
} from "@/repositories/PrismaReminderRepository";

type ReminderRepository = PrismaReminderRepository;

export class ReminderService {
  private reminderRepository: ReminderRepository;

  constructor(userRepository: ReminderRepository) {
    this.reminderRepository = userRepository;
  }

  async getReminders(): Promise<DatabaseReminder[] | null> {
    return this.reminderRepository.getReminders();
  }

  async getReminder(
    folderId: number,
    userId: number,
  ): Promise<{ dueDate: Date; schedule: string | null } | null> {
    return this.reminderRepository.getReminder(folderId, userId);
  }

  async upsertReminder(props: {
    userId: number;
    folderId: number;
    schedule: string | null;
    dueDate: Date;
  }): Promise<boolean | null> {
    return this.reminderRepository.upsertReminder(props);
  }

  async updateReminderDueDate(
    id: number,
    dueDate: Date,
  ): Promise<boolean | null> {
    return this.reminderRepository.updateReminderDueDate(id, dueDate);
  }

  async markReminderAsCompleted(id: number): Promise<boolean | null> {
    return this.reminderRepository.markReminderAsCompleted(id);
  }
}
