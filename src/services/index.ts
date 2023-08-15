import { PrismaClient } from "@prisma/client";
import { PrismaUserRepository } from "@/repositories/PrismaUserRepository";
import { PrismaFileRepository } from "@/repositories/PrismaFileRepository";
import { PrismaFolderRepository } from "@/repositories/PrismaFolderRepository";
import { FileService } from "./FileService";
import { FolderService } from "./FolderService";
import { UserService } from "./UserService";

const client = new PrismaClient();

const folderRepository = new PrismaFolderRepository();
export const folderService = new FolderService(folderRepository);

const fileRepository = new PrismaFileRepository();
export const fileService = new FileService(fileRepository);

const userRepository = new PrismaUserRepository(client);
export const userService = new UserService(userRepository);
