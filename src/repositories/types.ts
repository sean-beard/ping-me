import type { Folder, File, Notification, User } from "src/services/types";

export interface FolderRepository {
  getFolders(userId: number): Promise<Folder[] | null>;
  getFolder(folderId: number): Promise<Folder | null>;
  createFolder(folderName: string, userId: number): Promise<Folder | null>;
  updateFolder(
    folderId: number,
    newFolder: Partial<Folder>,
  ): Promise<Folder | null>;
  deleteFolder(folderId: number): Promise<number | null>;
  addFiles(folderId: number, files: File[]): Promise<Folder | null>;
  getFiles(folderId: number): Promise<File[] | null>;
  deleteFiles(folderId: number, fileIds: number[]): Promise<Folder | null>;
  getNotificationPreference(
    folderId: number,
    userId: number,
  ): Promise<Notification | null>;
  upsertNotificationPreference(
    folderId: number,
    userId: number,
    notificationPreference: string | null,
  ): Promise<Notification | null>;
}

export interface FileRepository {
  getFiles(userId: number): Promise<File[] | null>;
  getFile(fileId: number): Promise<File | null>;
  createFile(
    file: Omit<File, "id" | "userId">,
    userId: number,
  ): Promise<File | null>;
  updateFile(fileId: number, newFile: Partial<File>): Promise<File | null>;
  deleteFile(fileId: number): Promise<number | null>;
}

export interface UserRepository {
  getUser(username: string): Promise<User | null>;
  createUser(username: string, passwordHash: string): Promise<User | null>;
}
