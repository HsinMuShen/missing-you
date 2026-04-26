import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const userA = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      email: 'alice@example.com',
      name: 'Alice',
      defaultPrivacy: 'private',
    },
  });

  const userB = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      email: 'bob@example.com',
      name: 'Bob',
      defaultPrivacy: 'share',
    },
  });

  const journalA = await prisma.journal.upsert({
    where: { id: '6c531d8b-cffe-4f90-b8b0-c501db7193cc' },
    update: {},
    create: {
      id: '6c531d8b-cffe-4f90-b8b0-c501db7193cc',
      userId: userA.id,
      content: 'I still keep your old postcards by the window.',
      person: 'Grandma',
      privacy: 'private',
      status: 'draft',
    },
  });

  const journalB = await prisma.journal.upsert({
    where: { id: '63fca0c0-fcd3-4e9a-9859-8573d85f5e3c' },
    update: {},
    create: {
      id: '63fca0c0-fcd3-4e9a-9859-8573d85f5e3c',
      userId: userB.id,
      content: 'Your voice keeps me calm when nights are long.',
      person: 'Dad',
      privacy: 'share',
      status: 'anchored',
      memoryId: 'a872cbe3-78d8-49f6-8fc6-353cf8f7f5e2',
      anchor: {
        create: {
          memoryId: 'a872cbe3-78d8-49f6-8fc6-353cf8f7f5e2',
          contentHash: '0x' + 'a'.repeat(64),
          txHash: '0x' + 'b'.repeat(64),
          chain: 'polygon-amoy',
          chainId: 80002,
          contractAddress: '0x1111111111111111111111111111111111111111',
          anchoredAt: new Date(),
        },
      },
    },
    include: { anchor: true },
  });

  console.log('Seed complete', {
    users: [userA.email, userB.email],
    journals: [journalA.id, journalB.id],
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
