import type { PrismaFileRepository } from "@/repositories/PrismaFileRepository";
import type { File } from "./types";

type FileRepository = PrismaFileRepository;

export class FileService {
  private fileRepository: FileRepository;

  constructor(fileRepository: FileRepository) {
    this.fileRepository = fileRepository;
  }

  async getFiles(userId: number): Promise<File[] | null> {
    const files = await this.fileRepository.getFiles(userId);

    return files;
  }

  async getFilesByIds(
    fileIds: number[],
    userId: number,
  ): Promise<File[] | null> {
    const files = await this.fileRepository.getFilesByIds(fileIds, userId);

    if (!files) {
      return null;
    }

    return files.filter(Boolean) as File[];
  }

  async getFile(fileId: number, userId: number): Promise<File | null> {
    const file = await this.fileRepository.getFile(fileId);

    if (file?.userId !== userId) {
      console.log(
        `User ${userId} does not have access to file with ID: ${fileId}`,
      );
      return null;
    }

    return file;
  }

  async createFile(
    file: Omit<File, "id" | "userId">,
    userId: number,
    folderId?: string,
  ): Promise<File | null> {
    const newFile = await this.fileRepository.createFile(
      file,
      userId,
      folderId,
    );

    return newFile;
  }

  async updateFile(
    id: number,
    file: Partial<File>,
    userId: number,
  ): Promise<File | null> {
    const hasAccessToFile = await this.hasAccessToFile(id, userId);

    if (!hasAccessToFile) {
      return null;
    }

    const updatedFile = await this.fileRepository.updateFile(id, file);

    return updatedFile;
  }

  async deleteFile(id: number, userId: number): Promise<number | null> {
    const hasAccessToFile = await this.hasAccessToFile(id, userId);

    if (!hasAccessToFile) {
      return null;
    }

    const deletedFileId = await this.fileRepository.deleteFile(id);

    return deletedFileId;
  }

  private async hasAccessToFile(
    fileId: number,
    userId: number,
  ): Promise<boolean> {
    try {
      const file = await this.getFile(fileId, userId);

      if (!file) {
        console.log(`File with ID: ${fileId} cannot be found`);
        return false;
      }

      if (file?.userId !== userId) {
        console.log(
          `User ${userId} does not have access to file with ID: ${fileId}`,
        );
        return false;
      }

      return true;
    } catch {
      console.error("Error finding file with ID: " + fileId);
      return false;
    }
  }
}
