import { PrismaClient } from "@prisma/client";
import type { FolderRepository } from "./types";
import type { File, Folder } from "../services/types";

export class PrismaFolderRepository implements FolderRepository {
  private client: PrismaClient;

  constructor() {
    this.client = new PrismaClient();
  }

  async getFolders(): Promise<Folder[] | null> {
    try {
      const folders = await this.client.folder.findMany({
        select: { id: true, name: true, userId: true },
        orderBy: { id: "desc" },
      });

      return folders;
    } catch {
      console.error("Error getting folders");
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

  async createFolder(folderName: string): Promise<Folder | null> {
    const folder = await this.client.folder.create({
      data: {
        name: folderName,
        User: {
          // TODO: Replace this with the actual user ID
          connect: { id: 1 },
        },
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
}
