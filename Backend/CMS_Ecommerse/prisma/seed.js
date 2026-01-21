const prisma = require('../lib/prisma');

async function main() {
  console.log('🌱 Starting seed...');

  // Create test coupons
  console.log('Creating coupons...');

  const coupon1 = await prisma.phycoCoupon.upsert({
    where: { code: 'DISCOUNT10' },
    update: {},
    create: {
      code: 'DISCOUNT10',
      type: 'percentage',
      value: 10,
      minAmount: 10000,
      maxDiscount: 50000,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      isActive: true,
      usageLimit: 100,
      usedCount: 0,
    },
  });

  const coupon2 = await prisma.phycoCoupon.upsert({
    where: { code: 'SAVE5K' },
    update: {},
    create: {
      code: 'SAVE5K',
      type: 'fixed',
      value: 5000,
      minAmount: 20000,
      maxDiscount: null,
      startDate: new Date(),
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      isActive: true,
      usageLimit: null, // Unlimited
      usedCount: 0,
    },
  });

  const coupon3 = await prisma.phycoCoupon.upsert({
    where: { code: 'FREESHIP' },
    update: {},
    create: {
      code: 'FREESHIP',
      type: 'fixed',
      value: 15000,
      minAmount: 50000,
      maxDiscount: null,
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      isActive: true,
      usageLimit: 200,
      usedCount: 5,
    },
  });

  const coupon4 = await prisma.phycoCoupon.upsert({
    where: { code: 'EXPIRED' },
    update: {},
    create: {
      code: 'EXPIRED',
      type: 'percentage',
      value: 20,
      minAmount: 0,
      maxDiscount: 100000,
      startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
      endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // yesterday
      isActive: true,
      usageLimit: 50,
      usedCount: 10,
    },
  });

  console.log(`✅ Created ${4} coupons`);

  // Get existing products/variations for test orders
  const products = await prisma.phycoProduct.findMany({
    take: 3,
    include: {
      variations: true,
    },
  });

  if (products.length === 0) {
    console.log('⚠️  No products found. Please add products first.');
    return;
  }

  // Get or create test user
  let testUser = await prisma.user.findUnique({
    where: { email: 'test@radioshop.vn' },
  });

  if (!testUser) {
    testUser = await prisma.user.create({
      data: {
        username: 'Test User',
        email: 'test@radioshop.vn',
        password: 'hashed_password', // In production, use bcrypt
        role: 'USER',
      },
    });
  }

  console.log('Creating test orders...');

  // Order 1: Logged-in user, COD, PENDING
  if (products[0] && products[0].variations.length > 0) {
    const order1 = await prisma.phycoOrder.create({
      data: {
        userId: testUser.id,
        orderCode: `RAD${Date.now()}-1`,
        totalAmount: 150000,
        discount: 15000,
        status: 'PENDING',
        paymentMethod: 'COD',
        paymentStatus: 'UNPAID',
        items: {
          create: [
            {
              variationId: products[0].variations[0].id,
              quantity: 2,
              price: products[0].variations[0].price,
            },
          ],
        },
        address: {
          create: {
            fullName: 'Nguyễn Văn A',
            phone: '+84901234567',
            address: '123 Lê Hồng Phong',
            ward: 'Phường 1',
            district: 'Quận 10',
            city: 'TP. Hồ Chí Minh',
          },
        },
      },
    });
    console.log(`✅ Created order: ${order1.orderCode}`);
  }

  // Order 2: Guest checkout, Bank Transfer, CONFIRMED
  if (products[1] && products[1].variations.length > 0) {
    const order2 = await prisma.phycoOrder.create({
      data: {
        sessionId: 'guest-session-12345',
        orderCode: `RAD${Date.now()}-2`,
        totalAmount: 250000,
        discount: 25000,
        status: 'CONFIRMED',
        paymentMethod: 'BANK_TRANSFER',
        paymentStatus: 'PAID',
        customerName: 'Trần Thị B',
        customerEmail: 'customer@example.com',
        customerPhone: '+84987654321',
        items: {
          create: [
            {
              variationId: products[1].variations[0].id,
              quantity: 1,
              price: products[1].variations[0].price,
            },
          ],
        },
        address: {
          create: {
            fullName: 'Trần Thị B',
            phone: '+84987654321',
            address: '456 Nguyễn Trãi',
            ward: 'Phường 3',
            district: 'Quận 5',
            city: 'TP. Hồ Chí Minh',
          },
        },
      },
    });
    console.log(`✅ Created order: ${order2.orderCode}`);
  }

  // Order 3: Logged-in user, COD, DELIVERED
  if (products[2] && products[2].variations.length > 0) {
    const order3 = await prisma.phycoOrder.create({
      data: {
        userId: testUser.id,
        orderCode: `RAD${Date.now()}-3`,
        totalAmount: 85000,
        discount: 0,
        status: 'DELIVERED',
        paymentMethod: 'COD',
        paymentStatus: 'PAID',
        items: {
          create: [
            {
              variationId: products[2].variations[0].id,
              quantity: 3,
              price: products[2].variations[0].price,
            },
          ],
        },
        address: {
          create: {
            fullName: 'Lê Văn C',
            phone: '+84912345678',
            address: '789 Cách Mạng Tháng 8',
            ward: 'Phường 5',
            district: 'Quận 3',
            city: 'TP. Hồ Chí Minh',
          },
        },
      },
    });
    console.log(`✅ Created order: ${order3.orderCode}`);
  }

  // Order 4: Guest, CANCELLED
  if (products[0] && products[0].variations.length > 0) {
    const order4 = await prisma.phycoOrder.create({
      data: {
        sessionId: 'guest-session-67890',
        orderCode: `RAD${Date.now()}-4`,
        totalAmount: 120000,
        discount: 0,
        status: 'CANCELLED',
        paymentMethod: 'BANK_TRANSFER',
        paymentStatus: 'UNPAID',
        customerName: 'Phạm Văn D',
        customerEmail: 'guest@test.com',
        customerPhone: '+84923456789',
        items: {
          create: [
            {
              variationId: products[0].variations[0].id,
              quantity: 1,
              price: products[0].variations[0].price,
            },
          ],
        },
      },
    });
    console.log(`✅ Created order: ${order4.orderCode}`);
  }

  console.log('✨ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
