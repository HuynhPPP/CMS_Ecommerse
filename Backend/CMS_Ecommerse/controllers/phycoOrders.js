const prisma = require('../lib/prisma');

const PhycoOrdersController = {
  createPhycoOrder: async (req, res) => {
    try {
      const { userId, items, address } = req.body;

      if (!userId || !items || items.length === 0) {
        return res.status(400).json({ error: 'userId and items are required' });
      }

      // Calculate total amount
      let totalAmount = 0;
      const orderItems = [];

      for (const item of items) {
        const variation = await prisma.phycoProductVariation.findUnique({
          where: { id: item.variationId },
        });

        if (!variation) {
          return res.status(404).json({
            error: `Variation with ID ${item.variationId} not found`,
          });
        }

        // Check stock
        if (variation.manageStock && variation.stockQuantity < item.quantity) {
          return res.status(400).json({
            error: 'INSUFFICIENT_STOCK',
            message: `Không đủ hàng cho sản phẩm variation ID ${item.variationId}`,
          });
        }

        const itemTotal = variation.price * item.quantity;
        totalAmount += itemTotal;

        orderItems.push({
          variationId: item.variationId,
          quantity: item.quantity,
          price: variation.price,
        });
      }

      // Generate order code
      const orderCode = `PHYCO-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Create order
      const order = await prisma.phycoOrder.create({
        data: {
          userId,
          orderCode,
          totalAmount,
          status: 'PENDING',
          items: {
            create: orderItems,
          },
          ...(address && {
            address: {
              create: {
                fullName: address.fullName,
                phone: address.phone,
                address: address.address,
                ward: address.ward,
                district: address.district,
                city: address.city,
              },
            },
          }),
        },
        include: {
          items: {
            include: {
              variation: {
                include: {
                  product: {
                    select: {
                      id: true,
                      name: true,
                      slug: true,
                      featuredImageUrl: true,
                    },
                  },
                },
              },
            },
          },
          address: true,
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      });

      // Update stock quantities
      for (const item of items) {
        const variation = await prisma.phycoProductVariation.findUnique({
          where: { id: item.variationId },
        });

        if (variation.manageStock) {
          await prisma.phycoProductVariation.update({
            where: { id: item.variationId },
            data: {
              stockQuantity: variation.stockQuantity - item.quantity,
              stockStatus:
                variation.stockQuantity - item.quantity <= 0
                  ? 'outofstock'
                  : 'instock',
            },
          });
        }
      }

      return res.status(201).json(order);
    } catch (error) {
      console.error('Error creating Phyco order:', error);
      return res.status(500).json({ error: 'Failed to create order' });
    }
  },

  getPhycoOrders: async (req, res) => {
    try {
      let page = parseInt(req.query.page, 10) || 1;
      let limit = parseInt(req.query.limit, 10) || 10;

      const status = req.query.status;
      const userId = req.query.userId;
      const search = req.query.search;

      if (page < 1) page = 1;
      if (limit < 1) limit = 10;
      if (limit > 100) limit = 100;

      const skip = (page - 1) * limit;

      const where = {
        isDeleted: false,
        ...(status && { status }),
        ...(userId && { userId: parseInt(userId) }),
        ...(search && {
          orderCode: {
            contains: search,
            mode: 'insensitive',
          },
        }),
      };

      const [orders, total] = await Promise.all([
        prisma.phycoOrder.findMany({
          skip,
          take: limit,
          where,
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
            items: {
              include: {
                variation: {
                  include: {
                    product: {
                      select: {
                        id: true,
                        name: true,
                        slug: true,
                        featuredImageUrl: true,
                      },
                    },
                  },
                },
              },
            },
            address: true,
            _count: {
              select: {
                items: true,
              },
            },
          },
        }),
        prisma.phycoOrder.count({ where }),
      ]);

      return res.status(200).json({
        data: orders,
        meta: {
          total,
          page,
          limit,
          pageCount: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error('Error fetching Phyco orders:', error);
      return res.status(500).json({ error: 'Failed to fetch orders' });
    }
  },

  getPhycoOrderById: async (req, res) => {
    try {
      const { id } = req.params;

      const order = await prisma.phycoOrder.findUnique({
        where: { id: parseInt(id) },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
          items: {
            include: {
              variation: {
                include: {
                  product: true,
                },
              },
            },
          },
          address: true,
        },
      });

      if (!order) {
        return res.status(404).json({ error: 'Phyco order not found' });
      }

      return res.status(200).json(order);
    } catch (error) {
      console.error('Error fetching Phyco order:', error);
      return res.status(500).json({ error: 'Failed to fetch order' });
    }
  },

  updatePhycoOrderStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = [
        'PENDING',
        'CONFIRMED',
        'PROCESSING',
        'SHIPPED',
        'DELIVERED',
        'CANCELLED',
      ];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          error: 'Invalid status',
          validStatuses,
        });
      }

      const order = await prisma.phycoOrder.update({
        where: { id: parseInt(id) },
        data: { status },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
          items: {
            include: {
              variation: {
                include: {
                  product: true,
                },
              },
            },
          },
          address: true,
        },
      });

      return res.status(200).json(order);
    } catch (error) {
      console.error('Error updating Phyco order status:', error);
      return res.status(500).json({ error: 'Failed to update order status' });
    }
  },

  cancelPhycoOrder: async (req, res) => {
    try {
      const { id } = req.params;

      const order = await prisma.phycoOrder.findUnique({
        where: { id: parseInt(id) },
        include: {
          items: true,
        },
      });

      if (!order) {
        return res.status(404).json({ error: 'Phyco order not found' });
      }

      if (order.status === 'DELIVERED' || order.status === 'CANCELLED') {
        return res.status(400).json({
          error: 'Cannot cancel order',
          message: `Order is already ${order.status}`,
        });
      }

      // Restore stock quantities
      for (const item of order.items) {
        const variation = await prisma.phycoProductVariation.findUnique({
          where: { id: item.variationId },
        });

        if (variation.manageStock) {
          await prisma.phycoProductVariation.update({
            where: { id: item.variationId },
            data: {
              stockQuantity: variation.stockQuantity + item.quantity,
              stockStatus: 'instock',
            },
          });
        }
      }

      // Update order status
      const updatedOrder = await prisma.phycoOrder.update({
        where: { id: parseInt(id) },
        data: { status: 'CANCELLED' },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
          items: {
            include: {
              variation: {
                include: {
                  product: true,
                },
              },
            },
          },
          address: true,
        },
      });

      return res.status(200).json(updatedOrder);
    } catch (error) {
      console.error('Error cancelling Phyco order:', error);
      return res.status(500).json({ error: 'Failed to cancel order' });
    }
  },
};

module.exports = PhycoOrdersController;
