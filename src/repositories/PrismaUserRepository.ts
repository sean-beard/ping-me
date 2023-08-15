import type { PrismaClient } from "@prisma/client";
import type { User } from "@/services/types";
import type { UserRepository } from "./types";

export class PrismaUserRepository implements UserRepository {
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
      console.error("Error getting files");
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
    } catch {
      console.error("Error creating user");
      return null;
    }
  }
}
