import type { PushSubscription } from "web-push";
import type { PrismaClient } from "@prisma/client";
import type { PrismaReminderRepository } from "./PrismaReminderRepository";

type Reminder = NonNullable<
  Awaited<ReturnType<PrismaReminderRepository["getReminders"]>>
>[0];

export class PrismaNotificationRepository {
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  async createSubscription(
    userId: number,
    subscription: PushSubscription,
    origin: string,
  ) {
    try {
      await this.client.notificationSubscription.upsert({
        where: {
          userId_endpoint: {
            userId: userId,
            endpoint: subscription.endpoint,
          },
        },
        update: {},
        create: {
          endpoint: subscription.endpoint,
          auth: subscription.keys.auth,
          p256dh: subscription.keys.p256dh,
          origin,
          user: { connect: { id: userId } },
        },
      });
    } catch (error) {
      console.error(
        `Error creating subscription for user with ID ${userId}:`,
        error,
      );
      throw error;
    }
  }

  async updateNotification(
    id: number,
    notification: { isNotified?: boolean; notificationDatetime?: Date },
  ) {
    try {
      const updatedNotification = await this.client.notification.update({
        where: { id },
        data: notification,
      });

      return updatedNotification;
    } catch {
      console.error("Error updating notification with ID: " + id);
      return null;
    }
  }

  async createNotificationsToSend(reminder: Reminder) {
    let notifications = [];

    const subscriptions = await this.getNotificationSubscriptions(reminder);

    for (const subscription of subscriptions) {
      let newNotification;

      try {
        newNotification = await this.client.notification.create({
          data: {
            notificationDatetime: reminder.dueDate ?? undefined,
            reminder: { connect: { id: reminder.id } },
            user: { connect: { id: reminder.userId } },
            subscription: { connect: { id: subscription.id } },
          },
          include: { subscription: true },
        });
      } catch {
        console.error(
          `Error creating notification for reminder with data ${JSON.stringify({
            id: reminder.id,
            dueDate: reminder.dueDate,
            userId: reminder.userId,
            subscriptionId: subscription.id,
          })}`,
        );
        return [];
      }

      notifications.push(newNotification);
    }

    return notifications;
  }

  private async getNotificationSubscriptions(reminder: Reminder) {
    const subscriptions = await this.client.notificationSubscription.findMany({
      where: { userId: reminder.userId },
      select: {
        id: true,
        endpoint: true,
        p256dh: true,
        auth: true,
        origin: true,
      },
    });

    if (!subscriptions) {
      console.error(
        "Error getting subscriptions for user with ID: " + reminder.userId,
      );
      return [];
    }

    return subscriptions;
  }
}
