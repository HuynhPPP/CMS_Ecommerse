const prisma = require('../lib/prisma');

module.exports = {
  // Get wishlist
  getWishlist: async (req, res) => {
    try {
      const { sessionId } = req.query;
      const userId = req.user?.id;

      let wishlist;

      if (userId) {
        wishlist = await prisma.phycoWishlist.findUnique({
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
                  },
                },
              },
            },
          },
        });
      } else if (sessionId) {
        wishlist = await prisma.phycoWishlist.findUnique({
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
                  },
                },
              },
            },
          },
        });
      }

      if (!wishlist) {
        return res.status(200).json({
          data: {
            items: [],
            count: 0,
          },
        });
      }

      return res.status(200).json({
        data: {
          ...wishlist,
          count: wishlist.items.length,
        },
      });
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      return res.status(500).json({ error: 'Failed to fetch wishlist' });
    }
  },

  // Add item to wishlist
  addToWishlist: async (req, res) => {
    try {
      const { productId, sessionId } = req.body;
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

      let wishlist;

      // Find or create wishlist
      if (userId) {
        wishlist = await prisma.phycoWishlist.upsert({
          where: { userId },
          create: { userId },
          update: {},
        });
      } else if (sessionId) {
        wishlist = await prisma.phycoWishlist.upsert({
          where: { sessionId },
          create: { sessionId },
          update: {},
        });
      } else {
        return res
          .status(400)
          .json({ error: 'Session ID or user ID required' });
      }

      // Check if item already exists
      const existingItem = await prisma.phycoWishlistItem.findUnique({
        where: {
          wishlistId_productId: {
            wishlistId: wishlist.id,
            productId: parseInt(productId),
          },
        },
      });

      if (existingItem) {
        return res.status(400).json({ error: 'Item already in wishlist' });
      }

      // Create new item
      const wishlistItem = await prisma.phycoWishlistItem.create({
        data: {
          wishlistId: wishlist.id,
          productId: parseInt(productId),
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

      return res.status(200).json({
        message: 'Item added to wishlist',
        data: wishlistItem,
      });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return res.status(500).json({ error: 'Failed to add item to wishlist' });
    }
  },

  // Remove item from wishlist
  removeFromWishlist: async (req, res) => {
    try {
      const { id } = req.params;

      await prisma.phycoWishlistItem.delete({
        where: { id: parseInt(id) },
      });

      return res.status(200).json({
        message: 'Item removed from wishlist',
      });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return res
        .status(500)
        .json({ error: 'Failed to remove item from wishlist' });
    }
  },

  // Clear wishlist
  clearWishlist: async (req, res) => {
    try {
      const { sessionId } = req.query;
      const userId = req.user?.id;

      let wishlist;

      if (userId) {
        wishlist = await prisma.phycoWishlist.findUnique({ where: { userId } });
      } else if (sessionId) {
        wishlist = await prisma.phycoWishlist.findUnique({
          where: { sessionId },
        });
      }

      if (wishlist) {
        await prisma.phycoWishlistItem.deleteMany({
          where: { wishlistId: wishlist.id },
        });
      }

      return res.status(200).json({
        message: 'Wishlist cleared',
      });
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      return res.status(500).json({ error: 'Failed to clear wishlist' });
    }
  },
};
