import { PrismaClient } from "@prisma/client";
import type { FolderRepository } from "./types";
import type { File, Folder, Notification } from "../services/types";

export class PrismaFolderRepository implements FolderRepository {
  private client: PrismaClient;

  constructor() {
    this.client = new PrismaClient();
  }

  async getFolders(userId: number): Promise<Folder[] | null> {
    try {
      const folders = await this.client.folder.findMany({
        select: { id: true, name: true, userId: true },
        where: { userId },
        orderBy: { id: "desc" },
      });

      return folders;
    } catch {
      console.error("Error getting folders for user with ID: " + userId);
      return null;
    }
  }

  async getFolder(id: number) {
    const folder = await this.client.folder.findUnique({
      where: { id },
      select: { id: true, name: true, userId: true },
    });

    return folder;
  }

  async createFolder(
    folderName: string,
    userId: number,
  ): Promise<Folder | null> {
    const folder = await this.client.folder.create({
      data: {
        name: folderName,
        User: { connect: { id: userId } },
      },
      select: { id: true, name: true, userId: true },
    });

    return folder;
  }

  async updateFolder(
    id: number,
    newFolder: Partial<Folder>,
  ): Promise<Folder | null> {
    try {
      const folder = await this.client.folder.update({
        where: { id },
        data: {
          name: newFolder.name,
        },
        select: { id: true, name: true, userId: true },
      });

      return folder;
    } catch {
      console.error("Error updating folder with ID: " + id);
      return null;
    }
  }

  async deleteFolder(id: number): Promise<number | null> {
    try {
      const folder = await this.client.folder.delete({
        where: { id },
      });

      return folder.id;
    } catch {
      console.error("Error deleting folder with ID: " + id);
      return null;
    }
  }

  async addFiles(id: number, files: File[]): Promise<Folder | null> {
    try {
      const folder = await this.client.folder.update({
        where: { id },
        data: {
          files: {
            connect: files.map((file) => ({ id: file.id })),
          },
        },
      });

      return folder;
    } catch (error) {
      console.error("Error adding files to folder with ID: " + id);

      console.error(error);

      console.error(
        "File IDs: " + JSON.stringify(files.map((file) => file.id)),
      );
      return null;
    }
  }

  async getFiles(folderId: number): Promise<File[] | null> {
    try {
      const folder = await this.client.folder.findUnique({
        where: { id: folderId },
        select: {
          files: {
            select: {
              id: true,
              name: true,
              html: true,
              userId: true,
            },
          },
        },
      });

      return folder?.files ?? null;
    } catch {
      console.error("Error getting files for folder with ID: " + folderId);
      return null;
    }
  }

  async deleteFiles(
    folderId: number,
    fileIds: number[],
  ): Promise<Folder | null> {
    try {
      const updatedFolder = await this.client.folder.update({
        where: { id: folderId },
        data: {
          files: {
            disconnect: fileIds.map((id) => ({ id })),
          },
        },
      });

      return updatedFolder;
    } catch {
      console.error("Error deleting files with IDs: " + fileIds);
      return null;
    }
  }

  async getNotificationPreference(
    folderId: number,
    userId: number,
  ): Promise<Notification | null> {
    try {
      const notification = await this.client.notificationPreference.findUnique({
        where: { userId_folderId: { userId, folderId } },
        select: { schedule: true },
      });

      switch (notification?.schedule) {
        case "0 0 0 * * *":
          return { notificationPreference: "daily" };
        case "0 0 0 * * 0":
          return { notificationPreference: "weekly" };
        default:
          return { notificationPreference: "never" };
      }
    } catch {
      console.error(
        `Error getting notification preference for user ${userId} and folder ${folderId}`,
      );
      return null;
    }
  }

  async upsertNotificationPreference(
    userId: number,
    folderId: number,
    notificationPreference: string | null,
  ): Promise<Notification | null> {
    try {
      await this.client.notificationPreference.upsert({
        where: { userId_folderId: { userId, folderId } },
        create: {
          schedule: notificationPreference,
          user: { connect: { id: userId } },
          folder: { connect: { id: folderId } },
        },
        update: {
          schedule: notificationPreference,
        },
      });

      switch (notificationPreference) {
        case "0 0 0 * * *":
          return { notificationPreference: "daily" };
        case "0 0 0 * * 0":
          return { notificationPreference: "weekly" };
        default:
          return { notificationPreference: "never" };
      }
    } catch {
      console.error(
        `Error upserting notification preference for user ${userId} and folder ${folderId}`,
      );
      return null;
    }
  }
}
