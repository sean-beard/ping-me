import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      id: 1,
      username: "seanbeard",
      firstName: "Sean",
      lastName: "Beard",
      email: "sean@beard.io",
      password: { create: { hash: await bcrypt.hash("password", 10) } },
    },
  });

  console.log(user);
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
