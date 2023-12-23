import type { PrismaNotificationRepository } from "@/repositories/PrismaNotificationRepository";
import type { DatabaseReminder } from "@/repositories/PrismaReminderRepository";
import type { PushSubscription } from "web-push";

type NotificationRepository = PrismaNotificationRepository;

export class NotificationService {
  private notificationRepository: NotificationRepository;

  constructor(userRepository: NotificationRepository) {
    this.notificationRepository = userRepository;
  }

  async createSubscription(
    userId: number,
    subscription: PushSubscription,
    origin: string,
  ): Promise<void> {
    return this.notificationRepository.createSubscription(
      userId,
      subscription,
      origin,
    );
  }

  async createNotificationsToSend(reminder: DatabaseReminder) {
    return this.notificationRepository.createNotificationsToSend(reminder);
  }

  async updateNotification(
    id: number,
    notification: { isNotified?: boolean; notificationDatetime?: Date },
  ) {
    return this.notificationRepository.updateNotification(id, notification);
  }
}
