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

  getAllProducts: async (req, res) => {
    try {
      const products = await prisma.products.findMany({
        include: {
          colors: {
            include: {
              variants: true,
            },
          },
        },
      });
      return res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      return res.status(500).json({ message: 'Failed to fetch products' });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, categoryId, colors } = req.body;

      const product = await prisma.$transaction(async (tx) => {
        await tx.products.update({
          where: { id: parseInt(id, 10) },
          data: {
            name,
            description: description || '',
            categoryId,
          },
        });

        if (colors) {
          const existingColors = await tx.productColor.findMany({
            where: { productId: parseInt(id, 10) },
            include: {
              variants: {
                include: {
                  orderItem: true,
                },
              },
              images: true,
            },
          });

          const variantIdInOrder = new Set();

          existingColors.forEach((color) => {
            color.variants.forEach((variant) => {
              if (variant.orderItem.length > 0) {
                variantIdInOrder.add(variant.id);
              }
            });
          });

          const existingColorsMap = new Map();
          existingColors.forEach((color) => {
            existingColorsMap.set(color.color, color);
          });

          for (const incomingColor of colors) {
            const existingColor = existingColorsMap.get(incomingColor.color);
            if (existingColor) {
              await tx.productColor.deleteMany({
                where: {
                  colorId: existingColor.id,
                },
              });

              if (incomingColor.images?.length) {
                await tx.productColorImage.createMany({
                  data: incomingColor.images.map((image, index) => ({
                    colorId: existingColor.id,
                    imageUrl: image.imageUrl,
                    order: index,
                  })),
                });
              }

              await tx.productColor.update({
                where: {
                  id: existingColor.id,
                },
                data: {
                  colorCode: incomingColor.colorCode || '#000000',
                },
              });
              const existingVariantMap = new Map();
              existingColor.variants.forEach((variant) => {
                existingVariantMap.set(variant.size, variant);
              });

              const incomingVariantSizes = new Set(
                incomingColor.variants?.map((variant) => variant.size)
              );

              for (const existingVariant of existingColor.variants) {
                if (
                  !incomingVariantSizes.has(existingVariant.size) &&
                  !variantIdInOrder.has(existingVariant.id)
                ) {
                  await tx.productColorVariants.delete({
                    where: {
                      id: existingVariant.id,
                    },
                  });
                }
              }

              for (const incomingVariant of incomingColor.variants || []) {
                const existingVariant = existingVariantMap.get(
                  incomingVariant.size
                );
                if (existingVariant) {
                  await tx.productColorVariants.update({
                    where: {
                      id: existingVariant.id,
                    },
                    data: {
                      price: parseFloat(incomingVariant.price),
                      stock: parseInt(incomingVariant.stock, 10),
                    },
                  });
                } else {
                  await tx.productColorVariants.create({
                    data: {
                      colorId: existingColor.id,
                      size: incomingVariant.size,
                      price: parseFloat(incomingVariant.price),
                      stock: parseInt(incomingVariant.stock, 10),
                    },
                  });
                }

                existingColorsMap.delete(incomingColor.color);
              }

              const colorBlockedByOrders = [];
              const colorsToDelete = [];

              for (const [colorName, existingColor] of existingColorsMap) {
                const variantInOrders = existingColor.variants.filter(
                  (variant) => variantIdInOrders.has(variant.id)
                );
                if (variantInOrders) {
                  colorBlockedByOrders.push({
                    color: colorName,
                    variants: variantInOrders.map((variant) => variant.size),
                  });
                } else {
                  colorsToDelete.push(existingColor);
                }
              }

              if (colorBlockedByOrders.length > 0) {
                throw new Error(
                  'ORDERED_VARIANTS_EXIST:' +
                    JSON.stringify(colorBlockedByOrders)
                );
              }

              for (const color of colorsToDelete) {
                await tx.productColorVariants.deleteMany({
                  where: {
                    colorId: color.id,
                  },
                });
                await tx.productColorImage.deleteMany({
                  where: {
                    colorId: color.id,
                  },
                });
                await tx.productColor.delete({
                  where: {
                    id: color.id,
                  },
                });
              }
            }
          }
        } else {
          await tx.productColor.create({
            data: {
              productId: parseInt(id, 10),
              color: incomingColor.color,
              colorCode: incomingColor.colorCode || '#000000',
              images: {
                create: incomingColor.images?.map((image, index) => ({
                  imageUrl: image.imageUrl,
                  order: index,
                })),
              },
              variants: {
                create: incomingColor.variants?.map((variant) => ({
                  size: variant.size,
                  price: parseFloat(variant.price),
                  stock: parseInt(variant.stock, 10),
                })),
              },
            },
          });
        }

        return tx.products.findUnique({
          where: {
            id: parseInt(id, 10),
          },
          include: {
            colors: {
              include: {
                variants: true,
                images: true,
              },
            },
          },
        });
      });

      return res.status(200).json(product);
    } catch (error) {
      if (error.message?.startsWith('ORDERED_VARIANTS_EXIST:')) {
        const data = JSON.parse(
          error.message.replace('ORDERED_VARIANTS_EXIST:', '')
        );
        return res.status(400).json({
          error: 'ORDERED_VARIANTS_EXIST',
          message: 'Không thể xoá màu sắc / size vì có đơn hàng đã sử dụng',
          blockedColors: data,
        });
      }

      console.log(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  deleteProduct: async (req, res) => {
    const { id } = req.params;
    try {
      const productWithOrder = await prisma.products.findUnique({
        where: {
          id: parseInt(id, 10),
        },
        include: {
          colors: {
            include: {
              variants: {
                include: {
                  orderItems: true,
                },
              },
            },
          },
        },
      });

      if (!productWithOrder) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const variantsInOrders = [];

      productWithOrder.colors.forEach((color) => {
        color.variants.forEach((variant) => {
          if (!variant.orderItems && variant.orderItems.length > 0) {
            variantsInOrders.push({
              color: color.color,
              size: variant.size,
              ordersCount: variant.orderItems.length,
            });
          }
        });
      });

      if (variantsInOrders.length > 0) {
        const details = variantsInOrders
          .map(
            (variant) => `${variant.color} (${variant.ordersCount}) Đơn hàng`
          )
          .join(', ');

        return res.status(400).json({
          error: 'ORDERED_VARIANTS_EXIST',
          message: `Không thể xoá sản phẩm vì đã có khách hàng đặt hàng. Các biến thể: ${details}. Vui lòng liên hệ quản trị viên để xử lý`,
          variantsInOrders,
        });
      }

      await prisma.products.update({
        where: {
          id: parseInt(id, 10),
        },
        data: {
          isDeleted: true,
        },
      });

      return res.status(200).json({ message: 'Xoá sản phẩm thành công' });
    } catch (error) {
      console.log('Lỗi khi xoá sản phẩm:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = productsController;
