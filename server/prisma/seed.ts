import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const todos = [
  {
    text: "First To do",
    is_completed: false,
    order: 0,
  },
  {
    text: "Second To do",
    is_completed: false,
    order: 1,
  },
  {
    text: "Third To do",
    is_completed: false,
    order: 2,
  },
];

async function main() {
  await prisma.user.create({
    data: {
      name: "Andi",
    },
  });

  await prisma.todo.createMany({
    data: todos,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
