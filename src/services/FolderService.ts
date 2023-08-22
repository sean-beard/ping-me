import type { FolderRepository } from "../repositories/types";
import type { File, Folder } from "./types";

export class FolderService {
  private folderRepository: FolderRepository;

  constructor(folderRepository: FolderRepository) {
    this.folderRepository = folderRepository;
  }

  async getFolders(userId: number): Promise<Folder[] | null> {
    const folders = await this.folderRepository.getFolders(userId);

    return folders;
  }

  async getFolder(folderId: number, userId: number): Promise<Folder | null> {
    const folder = await this.folderRepository.getFolder(folderId);

    if (!folder) {
      console.log("Folder with ID: " + folderId + " does not exist");
      return null;
    }

    if (folder?.userId !== userId) {
      console.log(`User ${userId} does not own folder with ID: ${folderId}`);
      return null;
    }

    return folder;
  }

  async createFolder(
    folderName: string,
    userId: number,
  ): Promise<Folder | null> {
    const folder = await this.folderRepository.createFolder(folderName, userId);

    return folder;
  }

  async updateFolder(
    folderId: number,
    folder: Partial<Folder>,
  ): Promise<Folder | null> {
    // TODO: add check here

    const updatedFolder = await this.folderRepository.updateFolder(
      folderId,
      folder,
    );

    return updatedFolder;
  }

  async addFiles(
    folderId: number,
    files: File[],
    userId: number,
  ): Promise<Folder | null> {
    const isFolderOwnershipValid = await this.isFolderOwnershipValid(
      folderId,
      userId,
    );

    if (!isFolderOwnershipValid) {
      console.log(`User ${userId} does not own folder with ID: ${folderId}`);
      return null;
    }

    const updatedFolder = await this.folderRepository.addFiles(folderId, files);

    return updatedFolder;
  }

  // TODO: use folderId for all of these functions
  async getFiles(folderId: number, userId: number): Promise<File[] | null> {
    const isFolderOwnershipValid = await this.isFolderOwnershipValid(
      folderId,
      userId,
    );

    if (!isFolderOwnershipValid) {
      console.log(`User ${userId} does not own folder with ID: ${folderId}`);
      return null;
    }

    const files = await this.folderRepository.getFiles(folderId);

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

  async getRandomFile(folderId: number): Promise<File | null> {
    const files = await this.folderRepository.getFiles(folderId);

    if (!files) {
      return null;
    }

    return files[Math.floor(Math.random() * files.length)];
  }

  private async isFolderOwnershipValid(
    folderId: number,
    userId: number,
  ): Promise<boolean> {
    try {
      const folder = await this.getFolder(folderId, userId);

      if (!folder) {
        console.log(`Folder with ID: ${folderId} could not be found`);
        return false;
      }

      if (folder?.userId !== userId) {
        console.log(`User ${userId} does not own folder with ID: ${folderId}`);
        return false;
      }

      return true;
    } catch {
      console.error("Error finding folder with ID: " + folderId);
      return false;
    }
  }
}
