const prisma = require('../lib/prisma');

const cartsController = {
  // 1. Lấy giỏ hàng của người dùng
  getCart: async (req, res) => {
    try {
      const { userId } = req.params;

      let cart = await prisma.cart.findUnique({
        where: { userId: parseInt(userId) },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  color: {
                    include: {
                      product: true,
                      images: { where: { order: 0 }, take: 1 } // Lấy ảnh đại diện

                    }
                  }
                }
              }
            },
            orderBy: { createdAt: 'desc' }
          }
        }
      });

      // Nếu chưa có giỏ hàng thì tạo mới rỗng
      if (!cart) {
        cart = await prisma.cart.create({
          data: { userId: parseInt(userId) },
          include: { items: true }
        });
      }

      return res.status(200).json(cart);
    } catch (error) {
      console.error('Error fetching cart:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  // 2. Thêm sản phẩm vào giỏ hàng
  addToCart: async (req, res) => {
    try {
      const { userId, productId, quantity, size, colorId, isMultiple } = req.body;

      // a. Đảm bảo người dùng có giỏ hàng
      let cart = await prisma.cart.findUnique({
        where: { userId: parseInt(userId) }
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: { userId: parseInt(userId) }
        });
      }

      // b. Tìm Biến thể sản phẩm (Variant) dựa trên productId, size và colorId
      // Nếu không có colorId, lấy màu đầu tiên của sản phẩm
      let variantWhere = {
        size: size,
        color: {
          productId: parseInt(productId)
        }
      };

      if (colorId) {
        variantWhere.colorId = parseInt(colorId);
      }

      const variant = await prisma.productColorVariants.findFirst({
        where: variantWhere
      });

      if (!variant) {
        return res.status(404).json({ message: 'Không tìm thấy biến thể sản phẩm phù hợp' });
      }

      // c. Thêm hoặc cập nhật số lượng trong giỏ hàng
      const existingItem = await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productVariantId: variant.id
        }
      });

      if (existingItem) {
        if (isMultiple) {
          // Ghi đè số lượng (trường hợp sửa số lượng trong giỏ hàng)
          await prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: parseInt(quantity) || 1 }
          });
        } else {
          // Cộng dồn số lượng (trường hợp thêm từ trang sản phẩm)
          await prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + (parseInt(quantity) || 1) }
          });
        }
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productVariantId: variant.id,
            quantity: parseInt(quantity) || 1
          }
        });
      }

      return res.status(200).json({ message: 'Đã thêm vào giỏ hàng' });
    } catch (error) {
      console.error('Error adding to cart:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  // 3. Xóa một mục trong giỏ hàng
  deleteItem: async (req, res) => {
    try {
      const { cartItemId } = req.body; // Gửi ID của CartItem cần xóa

      await prisma.cartItem.delete({
        where: { id: parseInt(cartItemId) }
      });

      return res.status(200).json({ message: 'Đã xóa sản phẩm khỏi giỏ hàng' });
    } catch (error) {
      console.error('Error deleting cart item:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  // 4. Xóa sạch giỏ hàng
  clearCart: async (req, res) => {
    try {
      const { userId } = req.body;

      const cart = await prisma.cart.findUnique({
        where: { userId: parseInt(userId) }
      });

      if (cart) {
        await prisma.cartItem.deleteMany({
          where: { cartId: cart.id }
        });
      }

      return res.status(200).json({ message: 'Đã làm trống giỏ hàng' });
    } catch (error) {
      console.error('Error clearing cart:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = cartsController;
