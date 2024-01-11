import type { PrismaClient } from "@prisma/client";
import type { User } from "@/services/types";

export class PrismaUserRepository {
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  async getUser(username: string): Promise<User | null> {
    try {
      const user = await this.client.user.findUnique({
        where: { username },
        select: { id: true, password: { select: { hash: true } } },
      });

      if (!user || !user.password) {
        return null;
      }

      return { id: user.id, username, passwordHash: user.password.hash };
    } catch {
      console.error({ message: "Error querying user by username", username });
      return null;
    }
  }

  async createUser(
    username: string,
    passwordHash: string,
  ): Promise<User | null> {
    try {
      const user = await this.client.user.create({
        data: { username, password: { create: { hash: passwordHash } } },
        select: { id: true },
      });

      return { id: user.id, username, passwordHash };
    } catch (error) {
      console.error({
        message: "Error creating user",
        username,
        error,
      });
      return null;
    }
  }

  async getNotificationsEnabledPreference(userId: number): Promise<boolean> {
    try {
      const user = await this.client.user.findUnique({
        where: { id: userId },
        select: { notificationsEnabled: true },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return user.notificationsEnabled;
    } catch (error) {
      console.error({
        message: "Error getting notifications enabled preference",
        userId,
        error,
      });
      throw error;
    }
  }

  async setNotificationsEnabledPreference(
    userId: number,
    enabled: boolean,
  ): Promise<void> {
    try {
      await this.client.user.update({
        where: { id: userId },
        data: { notificationsEnabled: enabled },
      });
    } catch (error) {
      console.error({
        message: "Error setting notifications enabled preference",
        userId,
        enabled,
        error,
      });
      throw error;
    }
  }
}
