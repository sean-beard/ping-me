import type { FolderRepository } from "../repositories/types";
import type { File, Folder } from "./types";

export class FolderService {
  private folderRepository: FolderRepository;

  constructor(folderRepository: FolderRepository) {
    this.folderRepository = folderRepository;
  }

  async getFolders(): Promise<Folder[] | null> {
    const folders = await this.folderRepository.getFolders();

    return folders;
  }

  async getFolder(id: number): Promise<Folder | null> {
    const folder = await this.folderRepository.getFolder(id);

    return folder;
  }

  async createFolder(folderName: string): Promise<Folder | null> {
    const folder = await this.folderRepository.createFolder(folderName);

    return folder;
  }

  async updateFolder(
    id: number,
    folder: Partial<Folder>,
  ): Promise<Folder | null> {
    const updatedFolder = await this.folderRepository.updateFolder(id, folder);

    return updatedFolder;
  }

  async addFiles(id: number, files: File[]): Promise<Folder | null> {
    const updatedFolder = await this.folderRepository.addFiles(id, files);

    return updatedFolder;
  }

  async getFiles(id: number): Promise<File[] | null> {
    const files = await this.folderRepository.getFiles(id);

    return files;
  }

  async deleteFiles(
    folderId: number,
    fileIds: number[],
  ): Promise<Folder | null> {
    const updatedFolder = await this.folderRepository.deleteFiles(
      folderId,
      fileIds,
    );

    return updatedFolder;
  }
}
