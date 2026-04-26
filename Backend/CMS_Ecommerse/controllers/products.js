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

  getProducts: async (req, res) => {
    try {
      let page = parseInt(req.query.page, 10) || 1;
      let limit = parseInt(req.query.limit, 10) || 10;

      const search = req.query.search || '';
      const parsedCategoryId = parseInt(req.query.categoryId, 10);
      const categoryId = !Number.isNaN(parsedCategoryId) ? parsedCategoryId : undefined;

      if (page < 1) page = 1;
      if (limit < 1) limit = 10;
      if (limit > 100) limit = 100;

      const skip = (page - 1) * limit;

      const where = {
        isDeleted: false,
        ...(search && {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        }),
        ...(categoryId && { categoryId }),
      };

      const [products, total] = await Promise.all([
        prisma.products.findMany({
          skip,
          take: limit,
          where,
          orderBy: {
            id: 'desc',
          },
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
            colors: {
              include: {
                variants: true,
                images: true,
              },
            },
          },
        }),
        prisma.products.count({ where }),
      ]);

      return res.status(200).json({
        data: products,
        meta: {
          total,
          page,
          limit,
          pageCount: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      return res.status(500).json({ message: 'Failed to fetch products' });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, categoryId, colors } = req.body;

      // --- PHẦN DEBUG UPDATE ---
      // console.log('------------ DEBUG UPDATE PRODUCT DATA ------------');
      // console.log('Product ID:', id);
      // console.log('Data:', JSON.stringify(req.body, null, 2));

      // const fs = require('fs');
      // fs.writeFileSync('debug_update_product.json', JSON.stringify({ id, ...req.body }, null, 2));
      // console.log('-> Dữ liệu update đã được ghi vào file: debug_update_product.json');
      // console.log('---------------------------------------------------');
      // -------------------------

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
                  orderItems: true,
                },
              },
              images: true,
            },
          });

          const variantIdInOrder = new Set();
          existingColors.forEach((color) => {
            color.variants.forEach((variant) => {
              if (variant.orderItems && variant.orderItems.length > 0) {
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
              // Xóa ảnh cũ và tạo lại
              await tx.productColorImage.deleteMany({
                where: { colorId: existingColor.id },
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

              // Cập nhật mã màu
              await tx.productColor.update({
                where: { id: existingColor.id },
                data: { colorCode: incomingColor.colorCode || '#000000' },
              });

              // Xử lý Variants của màu này
              const existingVariantMap = new Map();
              existingColor.variants.forEach((v) => existingVariantMap.set(v.size, v));

              const incomingVariantSizes = new Set(incomingColor.variants?.map((v) => v.size));

              // Xóa size không còn tồn tại
              for (const exV of existingColor.variants) {
                if (!incomingVariantSizes.has(exV.size) && !variantIdInOrder.has(exV.id)) {
                  await tx.productColorVariants.delete({ where: { id: exV.id } });
                }
              }

              // Cập nhật hoặc tạo mới size
              for (const inV of incomingColor.variants || []) {
                const exV = existingVariantMap.get(inV.size);
                if (exV) {
                  await tx.productColorVariants.update({
                    where: { id: exV.id },
                    data: {
                      price: parseFloat(inV.price),
                      stock: parseInt(inV.stock, 10),
                    },
                  });
                } else {
                  await tx.productColorVariants.create({
                    data: {
                      colorId: existingColor.id,
                      size: inV.size,
                      price: parseFloat(inV.price),
                      stock: parseInt(inV.stock, 10),
                    },
                  });
                }
              }
              // Đánh dấu màu này đã được xử lý (để không bị xóa ở bước sau)
              existingColorsMap.delete(incomingColor.color);
            } else {
              // Tạo màu sắc hoàn toàn mới
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
          }

          // Xử lý xóa các màu sắc không còn trong danh sách gửi lên
          const colorBlockedByOrders = [];
          const colorsToDelete = [];

          for (const [colorName, exColor] of existingColorsMap) {
            const variantInOrders = exColor.variants.filter((v) => variantIdInOrder.has(v.id));
            if (variantInOrders.length > 0) {
              colorBlockedByOrders.push({
                color: colorName,
                variants: variantInOrders.map((v) => v.size),
              });
            } else {
              colorsToDelete.push(exColor);
            }
          }

          if (colorBlockedByOrders.length > 0) {
            throw new Error('ORDERED_VARIANTS_EXIST:' + JSON.stringify(colorBlockedByOrders));
          }

          for (const color of colorsToDelete) {
            await tx.productColorVariants.deleteMany({ where: { colorId: color.id } });
            await tx.productColorImage.deleteMany({ where: { colorId: color.id } });
            await tx.productColor.delete({ where: { id: color.id } });
          }
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
