import { PrismaClient } from "@prisma/client";
import type { FileRepository } from "./types";
import type { File } from "../services/types";

export class PrismaFileRepository implements FileRepository {
  private client: PrismaClient;

  constructor() {
    this.client = new PrismaClient();
  }

  async getFiles(userId: number): Promise<File[] | null> {
    try {
      const files = await this.client.file.findMany({
        select: { id: true, name: true, html: true, userId: true },
        where: { userId },
        orderBy: { id: "desc" },
      });

      return files;
    } catch {
      console.error("Error getting files");
      return null;
    }
  }

  async getFile(id: number): Promise<File | null> {
    const file = await this.client.file.findUnique({
      where: { id },
      select: { id: true, name: true, html: true, userId: true },
    });

    return file;
  }

  async createFile(
    file: Omit<File, "id" | "userId">,
    userId: number,
  ): Promise<File | null> {
    const newFile = await this.client.file.create({
      data: {
        name: file.name,
        html: file.html,
        user: { connect: { id: userId } },
      },
      select: { id: true, name: true, html: true, userId: true },
    });

    return newFile;
  }

  async updateFile(id: number, newFile: Partial<File>): Promise<File | null> {
    try {
      const file = await this.client.file.update({
        where: { id },
        data: {
          name: newFile.name,
          html: newFile.html,
        },
        select: { id: true, name: true, html: true, userId: true },
      });

      return file;
    } catch {
      console.error("Error updating file with ID: " + id);
      return null;
    }
  }

  async deleteFile(id: number): Promise<number | null> {
    try {
      const file = await this.client.file.delete({
        where: { id },
      });

      return file.id;
    } catch {
      console.error("Error deleting file with ID: " + id);
      return null;
    }
  }
}
