const prisma = require('../lib/prisma');

const productsController = {
  createProduct: async (req, res) => {
    try {
      const { name, description, categoryId, colors } = req.body;

      if (!name || !categoryId) {
        return res
          .status(400)
          .json({ error: 'Name and categoryId are required' });
      }

      const product = await prisma.products.create({
        data: {
          name,
          description: description || '',
          categoryId,
          colors: {
            create: (colors || []).map((c) => ({
              color: c.color,
              colorCode: c.colorCode,
              images: {
                create: (c.images || []).map((image, index) => ({
                  imageUrl: image.imageUrl,
                  order: index,
                })),
              },
              variants: {
                create: (c.variants || []).map((variant) => ({
                  size: variant.size,
                  price: parseFloat(variant.price),
                  stock: parseInt(variant.stock),
                })),
              },
            })),
          },
        },
        include: {
          colors: {
            include: {
              variants: true,
            },
          },
        },
      });

      return res.status(201).json(product);
    } catch (error) {
      console.error('Error creating product:', error);
      return res.status(500).json({ message: 'Failed to create product' });
    }
  },
};

module.exports = productsController;
