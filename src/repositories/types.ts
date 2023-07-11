import type { Folder, File } from "../services/types";

export interface FolderRepository {
  getFolders(): Promise<Folder[] | null>;
  getFolder(id: number): Promise<Folder | null>;
  createFolder(folderName: string): Promise<Folder | null>;
  updateFolder(id: number, newFolder: Partial<Folder>): Promise<Folder | null>;
  deleteFolder(id: number): Promise<number | null>;
  addFiles(id: number, files: File[]): Promise<Folder | null>;
  getFiles(id: number): Promise<File[] | null>;
  deleteFiles(folderId: number, fileIds: number[]): Promise<Folder | null>;
}

export interface FileRepository {
  getFiles(): Promise<File[] | null>;
  getFile(id: number): Promise<File | null>;
  createFile(file: Omit<File, "id" | "userId">): Promise<File | null>;
  updateFile(id: number, newFile: Partial<File>): Promise<File | null>;
  deleteFile(id: number): Promise<number | null>;
}
