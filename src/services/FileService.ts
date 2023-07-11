import type { FileRepository } from "../repositories/types";
import type { File } from "./types";

export class FileService {
  private fileRepository: FileRepository;

  constructor(fileRepository: FileRepository) {
    this.fileRepository = fileRepository;
  }

  async getFiles(): Promise<File[] | null> {
    const files = await this.fileRepository.getFiles();

    return files;
  }

  async getFile(id: number): Promise<File | null> {
    const file = await this.fileRepository.getFile(id);

    return file;
  }

  async createFile(file: Omit<File, "id" | "userId">): Promise<File | null> {
    const newFile = await this.fileRepository.createFile(file);

    return newFile;
  }

  async updateFile(id: number, file: Partial<File>): Promise<File | null> {
    const updatedFile = await this.fileRepository.updateFile(id, file);

    return updatedFile;
  }

  async deleteFile(id: number): Promise<number | null> {
    const deletedFileId = await this.fileRepository.deleteFile(id);

    return deletedFileId;
  }
}
