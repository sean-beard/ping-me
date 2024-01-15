import { PrismaClient } from "@prisma/client";
import { fileService } from "@/services";

const USER_ID = 1;
const NUM_FILES_TO_CREATE = 10;
const FILE = {
  name: "My Auto Generated File",
  html: "<p>Hello World</p>",
};

const prisma = new PrismaClient();

async function main() {
  for (let i = 0; i < NUM_FILES_TO_CREATE; i++) {
    await fileService.createFile(FILE, USER_ID);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
