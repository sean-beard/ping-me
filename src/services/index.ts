import { PrismaFileRepository } from "../repositories/PrismaFileRepository";
import { PrismaFolderRepository } from "../repositories/PrismaFolderRepository";
import { FileService } from "./FileService";
import { FolderService } from "./FolderService";

const folderRepository = new PrismaFolderRepository();
export const folderService = new FolderService(folderRepository);

const fileRepository = new PrismaFileRepository();
export const fileService = new FileService(fileRepository);
