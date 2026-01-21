const prisma = require('../lib/prisma');

const PhycoOrdersController = {
  createPhycoOrder: async (req, res) => {
    try {
      const {
        userId,
        sessionId,
        customerInfo, // { name, email, phone } for guest
        items, // From cart items
        address,
        paymentMethod = 'COD',
        totalAmount,
        discount = 0,
      } = req.body;

      // Validate: must have either userId or sessionId
      if (!userId && !sessionId) {
        return res
          .status(400)
          .json({ error: 'Either userId or sessionId is required' });
      }

      if (!items || items.length === 0) {
        return res.status(400).json({ error: 'Items are required' });
      }

      // For guest checkout, require customer info
      if (
        !userId &&
        (!customerInfo ||
          !customerInfo.name ||
          !customerInfo.email ||
          !customerInfo.phone)
      ) {
        return res.status(400).json({
          error:
            'Customer name, email and phone are required for guest checkout',
        });
      }

      // Calculate total if not provided (from cart items)
      let calculatedTotal = 0;
      const orderItems = [];

      for (const item of items) {
        // Support both productId (simple products) and variationId
        let product, variation, price;

        if (item.variationId) {
          variation = await prisma.phycoProductVariation.findUnique({
            where: { id: item.variationId },
          });

          if (!variation) {
            return res.status(404).json({
              error: `Variation with ID ${item.variationId} not found`,
            });
          }

          // Check stock
          if (
            variation.manageStock &&
            variation.stockQuantity < item.quantity
          ) {
            return res.status(400).json({
              error: 'INSUFFICIENT_STOCK',
              message: `Không đủ hàng cho sản phẩm`,
            });
          }

          price = variation.salePrice || variation.price;
          orderItems.push({
            variationId: item.variationId,
            quantity: item.quantity,
            price,
          });
        } else if (item.productId) {
          product = await prisma.phycoProduct.findUnique({
            where: { id: item.productId },
          });

          if (!product) {
            return res.status(404).json({
              error: `Product with ID ${item.productId} not found`,
            });
          }

          // Check stock
          if (product.manageStock && product.stockQuantity < item.quantity) {
            return res.status(400).json({
              error: 'INSUFFICIENT_STOCK',
              message: `Không đủ hàng cho sản phẩm ${product.name}`,
            });
          }

          price = product.salePrice || product.price;

          // For simple product without variation, we need to create a default variation
          // Or store productId directly (need schema update)
          // For now, require all products to have variations
          return res.status(400).json({
            error:
              'Product must have variations. Please add product variations first.',
          });
        }

        calculatedTotal += price * item.quantity;
      }

      const finalTotal = totalAmount || calculatedTotal - (discount || 0);

      // Generate order code
      const orderCode = `RAD${Date.now()}`;

      // Create order
      const order = await prisma.phycoOrder.create({
        data: {
          userId,
          sessionId,
          orderCode,
          totalAmount: finalTotal,
          discount,
          status: 'PENDING',
          paymentMethod,
          paymentStatus: paymentMethod === 'COD' ? 'UNPAID' : 'UNPAID',
          customerName: customerInfo?.name,
          customerEmail: customerInfo?.email,
          customerPhone: customerInfo?.phone,
          items: {
            create: orderItems,
          },
          ...(address && {
            address: {
              create: {
                fullName: address.fullName || customerInfo?.name,
                phone: address.phone || customerInfo?.phone,
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
        if (item.variationId) {
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
      }

      // Clear cart if order successful
      if (userId) {
        await prisma.phycoCartItem.deleteMany({
          where: { cart: { userId } },
        });
      } else if (sessionId) {
        await prisma.phycoCartItem.deleteMany({
          where: { cart: { sessionId } },
        });
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
      const sessionId = req.query.sessionId;
      const search = req.query.search;

      if (page < 1) page = 1;
      if (limit < 1) limit = 10;
      if (limit > 100) limit = 100;

      const skip = (page - 1) * limit;

      const where = {
        isDeleted: false,
        ...(status && { status }),
        ...(userId && { userId: parseInt(userId) }),
        ...(sessionId && { sessionId }),
        ...(search && {
          OR: [
            {
              orderCode: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              customerEmail: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
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
