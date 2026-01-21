const prisma = require('../lib/prisma');

module.exports = {
  // Get cart (for both guest and logged-in users)
  getCart: async (req, res) => {
    try {
      const { sessionId } = req.query;
      const userId = req.user?.id; // From auth middleware if logged in

      let cart;

      if (userId) {
        // Logged-in user
        cart = await prisma.phycoCart.findUnique({
          where: { userId },
          include: {
            items: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    price: true,
                    salePrice: true,
                    featuredImageUrl: true,
                    stockStatus: true,
                    stockQuantity: true,
                  },
                },
              },
            },
          },
        });
      } else if (sessionId) {
        // Guest user
        cart = await prisma.phycoCart.findUnique({
          where: { sessionId },
          include: {
            items: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    price: true,
                    salePrice: true,
                    featuredImageUrl: true,
                    stockStatus: true,
                    stockQuantity: true,
                  },
                },
              },
            },
          },
        });
      }

      if (!cart) {
        return res.status(200).json({
          data: {
            items: [],
            total: 0,
            count: 0,
          },
        });
      }

      // Calculate total
      const total = cart.items.reduce((sum, item) => {
        const price = item.product.salePrice || item.product.price || 0;
        return sum + price * item.quantity;
      }, 0);

      return res.status(200).json({
        data: {
          ...cart,
          total,
          count: cart.items.length,
        },
      });
    } catch (error) {
      console.error('Error fetching cart:', error);
      return res.status(500).json({ error: 'Failed to fetch cart' });
    }
  },

  // Add item to cart
  addToCart: async (req, res) => {
    try {
      const { productId, quantity = 1, sessionId } = req.body;
      const userId = req.user?.id;

      if (!productId) {
        return res.status(400).json({ error: 'Product ID is required' });
      }

      // Check if product exists
      const product = await prisma.phycoProduct.findUnique({
        where: { id: parseInt(productId) },
      });

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      let cart;

      // Find or create cart
      if (userId) {
        cart = await prisma.phycoCart.upsert({
          where: { userId },
          create: { userId },
          update: {},
        });
      } else if (sessionId) {
        cart = await prisma.phycoCart.upsert({
          where: { sessionId },
          create: { sessionId },
          update: {},
        });
      } else {
        return res
          .status(400)
          .json({ error: 'Session ID or user ID required' });
      }

      // Check if item already exists in cart
      const existingItem = await prisma.phycoCartItem.findUnique({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId: parseInt(productId),
          },
        },
      });

      let cartItem;

      if (existingItem) {
        // Update quantity
        cartItem = await prisma.phycoCartItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: existingItem.quantity + parseInt(quantity),
          },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                salePrice: true,
                featuredImageUrl: true,
              },
            },
          },
        });
      } else {
        // Create new item
        cartItem = await prisma.phycoCartItem.create({
          data: {
            cartId: cart.id,
            productId: parseInt(productId),
            quantity: parseInt(quantity),
          },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                salePrice: true,
                featuredImageUrl: true,
              },
            },
          },
        });
      }

      return res.status(200).json({
        message: 'Item added to cart',
        data: cartItem,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      return res.status(500).json({ error: 'Failed to add item to cart' });
    }
  },

  // Update cart item quantity
  updateCartItem: async (req, res) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      if (!quantity || quantity < 1) {
        return res.status(400).json({ error: 'Invalid quantity' });
      }

      const cartItem = await prisma.phycoCartItem.update({
        where: { id: parseInt(id) },
        data: { quantity: parseInt(quantity) },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              salePrice: true,
              featuredImageUrl: true,
            },
          },
        },
      });

      return res.status(200).json({
        message: 'Cart item updated',
        data: cartItem,
      });
    } catch (error) {
      console.error('Error updating cart item:', error);
      return res.status(500).json({ error: 'Failed to update cart item' });
    }
  },

  // Remove item from cart
  removeFromCart: async (req, res) => {
    try {
      const { id } = req.params;

      await prisma.phycoCartItem.delete({
        where: { id: parseInt(id) },
      });

      return res.status(200).json({
        message: 'Item removed from cart',
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      return res.status(500).json({ error: 'Failed to remove item from cart' });
    }
  },

  // Clear cart
  clearCart: async (req, res) => {
    try {
      const { sessionId } = req.query;
      const userId = req.user?.id;

      let cart;

      if (userId) {
        cart = await prisma.phycoCart.findUnique({ where: { userId } });
      } else if (sessionId) {
        cart = await prisma.phycoCart.findUnique({ where: { sessionId } });
      }

      if (cart) {
        await prisma.phycoCartItem.deleteMany({
          where: { cartId: cart.id },
        });
      }

      return res.status(200).json({
        message: 'Cart cleared',
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      return res.status(500).json({ error: 'Failed to clear cart' });
    }
  },

  // Apply coupon code
  applyCoupon: async (req, res) => {
    try {
      const { code, sessionId } = req.body;
      const userId = req.user?.id;

      if (!code) {
        return res.status(400).json({ error: 'Coupon code is required' });
      }

      // Find cart
      let cart;
      if (userId) {
        cart = await prisma.phycoCart.findUnique({
          where: { userId },
          include: {
            items: {
              include: {
                product: {
                  select: { price: true, salePrice: true },
                },
              },
            },
          },
        });
      } else if (sessionId) {
        cart = await prisma.phycoCart.findUnique({
          where: { sessionId },
          include: {
            items: {
              include: {
                product: {
                  select: { price: true, salePrice: true },
                },
              },
            },
          },
        });
      }

      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
      }

      // Find coupon
      const coupon = await prisma.phycoCoupon.findUnique({
        where: { code: code.toUpperCase() },
      });

      if (!coupon) {
        return res.status(404).json({ error: 'Invalid coupon code' });
      }

      // Validate coupon
      const now = new Date();
      if (!coupon.isActive) return res.status(400).json({ error: 'Coupon is inactive' });
      if (now < coupon.startDate) return res.status(400).json({ error: 'Coupon is not yet valid' });
      if (now > coupon.endDate) return res.status(400).json({ error: 'Coupon has expired' });
      if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
        return res.status(400).json({ error: 'Coupon usage limit reached' });
      }

      // Calculate cart total
      const subtotal = cart.items.reduce((sum, item) => {
        const price = item.product.salePrice || item.product.price || 0;
        return sum + price * item.quantity;
      }, 0);

      // Check minimum amount
      if (coupon.minAmount && subtotal < coupon.minAmount) {
        return res.status(400).json({
          error: `Minimum order amount is ${coupon.minAmount.toLocaleString('vi-VN')}`,
        });
      }

      // Calculate discount
      let discount = 0;
      if (coupon.type === 'percentage') {
        discount = (subtotal * coupon.value) / 100;
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
      } else if (coupon.type === 'fixed') {
        discount = coupon.value;
      }

      // Update cart with coupon
      const updatedCart = await prisma.phycoCart.update({
        where: { id: cart.id },
        data: { couponCode: coupon.code, discount },
        include: {
          items: {
            include: {
              product: {
                select: { id: true, name: true, slug: true, price: true, salePrice: true, featuredImageUrl: true },
              },
            },
          },
        },
      });

      return res.status(200).json({
        message: 'Coupon applied successfully',
        data: { ...updatedCart, subtotal, total: subtotal - discount, count: updatedCart.items.length },
      });
    } catch (error) {
      console.error('Error applying coupon:', error);
      return res.status(500).json({ error: 'Failed to apply coupon' });
    }
  },

  // Remove coupon
  removeCoupon: async (req, res) => {
    try {
      const { sessionId } = req.query;
      const userId = req.user?.id;

      let cart;
      if (userId) {
        cart = await prisma.phycoCart.findUnique({ where: { userId } });
      } else if (sessionId) {
        cart = await prisma.phycoCart.findUnique({ where: { sessionId } });
      }

      if (!cart) return res.status(404).json({ error: 'Cart not found' });

      await prisma.phycoCart.update({
        where: { id: cart.id },
        data: { couponCode: null, discount: 0 },
      });

      return res.status(200).json({ message: 'Coupon removed' });
    } catch (error) {
      console.error('Error removing coupon:', error);
      return res.status(500).json({ error: 'Failed to remove coupon' });
    }
  },
};