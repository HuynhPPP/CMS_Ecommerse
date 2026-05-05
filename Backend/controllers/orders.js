const prisma = require('../lib/prisma');

const ordersController = {
  // 1. Tạo đơn hàng mới
  createOrder: async (req, res) => {
    const { userId, items, totalAmount, addressData, paymentMethod } = req.body;

    console.log("==========================================");
    console.log(req.body);
    console.log("==========================================");
    console.log(addressData);

    // Hỗ trợ cả dữ liệu đóng gói trong addressData (Postman) hoặc dữ liệu phẳng (Frontend form)
    const finalAddress = addressData || req.body;

    try {
      const result = await prisma.$transaction(async (tx) => {
        // a. Tạo đơn hàng
        const order = await tx.order.create({
          data: {
            userId: parseInt(userId),
            totalAmount: parseFloat(totalAmount),
            status: 'PENDING',
            paymentMethod: paymentMethod || 'COD',
            items: {
              create: items.map((item) => ({
                productVariantId: item.productVariantId,
                quantity: item.quantity,
                price: parseFloat(item.price),
              })),
            },
            address: {
              create: {
                userId: parseInt(userId),
                firstName: String(finalAddress.firstName),
                lastName: String(finalAddress.lastName),
                companyName: finalAddress.companyName ? String(finalAddress.companyName) : null,
                country: String(finalAddress.country),
                street: String(finalAddress.street),
                apartment: finalAddress.apartment ? String(finalAddress.apartment) : null,
                city: String(finalAddress.cities || finalAddress.city),
                state: String(finalAddress.state),
                phone: String(finalAddress.phone),
                zipCode: String(finalAddress.zipCode),
                email: String(finalAddress.email),
              },
            },
          },
          include: {
            items: true,
            address: true,
          },
        });

        // b. Trừ tồn kho sản phẩm
        for (const item of items) {
          const variant = await tx.productColorVariants.findUnique({
            where: { id: item.productVariantId },
          });

          if (!variant || variant.stock < item.quantity) {
            throw new Error(`Sản phẩm với ID biến thể ${item.productVariantId} không đủ hàng hoặc không tồn tại.`);
          }

          await tx.productColorVariants.update({
            where: { id: item.productVariantId },
            data: {
              stock: variant.stock - item.quantity,
            },
          });
        }

        return order;
      });

      return res.status(201).json({
        message: 'Đặt hàng thành công',
        order: result,
      });
    } catch (error) {
      console.error('Lỗi đặt hàng chi tiết:', error);
      return res.status(400).json({
        message: 'Đặt hàng thất bại, vui lòng kiểm tra lại giỏ hàng hoặc thử lại sau.',
      });
    }
  },

  // 2. Lấy danh sách đơn hàng của một người dùng
  getOrdersByUser: async (req, res) => {
    try {
      const { userId } = req.params;
      const orders = await prisma.order.findMany({
        where: {
          userId: parseInt(userId),
          isDeleted: false,
        },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  color: {
                    include: {
                      product: true,
                    },
                  },
                },
              },
            },
          },
          address: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return res.status(200).json(orders);
    } catch (error) {
      console.error('Lỗi lấy danh sách đơn hàng:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  // 3. Lấy chi tiết một đơn hàng
  getOrderById: async (req, res) => {
    try {
      const { id } = req.params;
      const orderId = parseInt(id);

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  color: {
                    include: {
                      product: true,
                      images: true
                    },
                  },
                },
              },
            },
          },
          address: true,
          user: {
            select: {
              username: true,
              email: true,
            },
          },
        },
      });

      if (!order) {
        return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
      }

      return res.status(200).json(order);
    } catch (error) {
      console.error('Lỗi lấy chi tiết đơn hàng:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  // 4. Cập nhật trạng thái đơn hàng (Dùng cho CMS/Admin)
  updateOrderStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const order = await prisma.order.update({
        where: { id: parseInt(id) },
        data: { status },
      });

      return res.status(200).json({
        message: 'Cập nhật trạng thái thành công',
        order,
      });
    } catch (error) {
      console.error('Lỗi cập nhật đơn hàng:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  // 5. Lấy tất cả đơn hàng (Dùng cho Admin)
  getAllOrders: async (req, res) => {
    try {
      const orders = await prisma.order.findMany({
        where: { isDeleted: false },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  color: {
                    include: {
                      product: true,
                      images: true,
                    },
                  },
                },
              },
            },
          },
          address: true,
          user: {
            select: {
              username: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return res.status(200).json(orders);
    } catch (error) {
      console.error('Lỗi lấy danh sách tất cả đơn hàng:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
};

module.exports = ordersController;
