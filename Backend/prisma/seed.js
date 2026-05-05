const prisma = require('../lib/prisma');

async function main() {
  console.log('🌱 Starting seeding users...');

  const users = [
    {
      username: 'admin',
      email: 'admin@example.com',
      password: 'adminpassword123',
      role: 'ADMIN',
      isActive: true,
    },
    {
      username: 'huynh_dev',
      email: 'huynh@example.com',
      password: 'password123',
      role: 'USER',
      isActive: true,
    },
    {
      username: 'john_doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'USER',
      isActive: true,
    },
    {
      username: 'jane_smith',
      email: 'jane@example.com',
      password: 'password123',
      role: 'USER',
      isActive: true,
    },
    {
      username: 'test_user',
      email: 'test@example.com',
      password: 'password123',
      role: 'USER',
      isActive: false, // User bị khóa
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }

  console.log('✅ Seeded 5 users successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
