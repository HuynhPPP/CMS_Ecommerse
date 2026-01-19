const prisma = require('../lib/prisma');

const PhycoProductsController = {
  createPhycoProduct: async (req, res) => {
    try {
      const {
        sku,
        name,
        slug,
        status,
        type,
        shortDescription,
        description,
        categoryId,
        authorId,
        price,
        regularPrice,
        salePrice,
        saleStart,
        saleEnd,
        stockStatus,
        stockQuantity,
        manageStock,
        backordersAllowed,
        featuredImageUrl,
        imageAlt,
        weight,
        length,
        width,
        height,
        shippingClassId,
        taxStatus,
        taxClass,
        virtual,
        downloadable,
        purchaseNote,
        images,
        tags,
        attributes,
        variations,
        downloads,
      } = req.body;

      if (!name || !slug || !categoryId) {
        return res
          .status(400)
          .json({ error: 'Name, slug, and categoryId are required' });
      }

      const product = await prisma.phycoProduct.create({
        data: {
          sku,
          name,
          slug,
          status: status || 'publish',
          type: type || 'simple',
          shortDescription,
          description,
          categoryId,
          authorId,
          price: price ? parseFloat(price) : null,
          regularPrice: regularPrice ? parseFloat(regularPrice) : null,
          salePrice: salePrice ? parseFloat(salePrice) : null,
          saleStart: saleStart ? new Date(saleStart) : null,
          saleEnd: saleEnd ? new Date(saleEnd) : null,
          stockStatus: stockStatus || 'instock',
          stockQuantity: stockQuantity ? parseInt(stockQuantity) : null,
          manageStock: manageStock || false,
          backordersAllowed: backordersAllowed || false,
          featuredImageUrl,
          imageAlt,
          weight,
          length: length ? parseFloat(length) : null,
          width: width ? parseFloat(width) : null,
          height: height ? parseFloat(height) : null,
          shippingClassId: shippingClassId ? parseInt(shippingClassId) : null,
          taxStatus: taxStatus || 'taxable',
          taxClass,
          virtual: virtual || false,
          downloadable: downloadable || false,
          purchaseNote,
          images: {
            create: (images || []).map((img, index) => ({
              imageUrl: img.imageUrl,
              imageAlt: img.imageAlt,
              order: img.order !== undefined ? img.order : index,
            })),
          },
          tags: {
            create: (tags || []).map((tag) => ({
              name: tag.name,
              slug: tag.slug,
            })),
          },
          attributes: {
            create: (attributes || []).map((attr) => ({
              name: attr.name,
              slug: attr.slug,
              visible: attr.visible !== undefined ? attr.visible : true,
              variation: attr.variation || false,
              options: attr.options || [],
            })),
          },
          variations: {
            create: (variations || []).map((v) => ({
              sku: v.sku,
              price: parseFloat(v.price),
              regularPrice: v.regularPrice ? parseFloat(v.regularPrice) : null,
              salePrice: v.salePrice ? parseFloat(v.salePrice) : null,
              saleStart: v.saleStart ? new Date(v.saleStart) : null,
              saleEnd: v.saleEnd ? new Date(v.saleEnd) : null,
              stockStatus: v.stockStatus || 'instock',
              stockQuantity: v.stockQuantity ? parseInt(v.stockQuantity) : null,
              manageStock: v.manageStock || false,
              backordersAllowed: v.backordersAllowed || false,
              attributes: v.attributes || {},
              imageUrl: v.imageUrl,
              weight: v.weight,
              length: v.length ? parseFloat(v.length) : null,
              width: v.width ? parseFloat(v.width) : null,
              height: v.height ? parseFloat(v.height) : null,
            })),
          },
          downloads: {
            create: (downloads || []).map((dl) => ({
              name: dl.name,
              fileUrl: dl.fileUrl,
            })),
          },
        },
        include: {
          category: true,
          images: true,
          tags: true,
          attributes: true,
          variations: true,
          downloads: true,
        },
      });

      return res.status(201).json(product);
    } catch (error) {
      console.error('Error creating Phyco product:', error);
      return res.status(500).json({ error: 'Failed to create product' });
    }
  },

  getPhycoProducts: async (req, res) => {
    try {
      let page = parseInt(req.query.page, 10) || 1;
      let limit = parseInt(req.query.limit, 10) || 10;

      const search = req.query.search || '';
      const categoryId = req.query.categoryId;
      const includeChildren = req.query.includeChildren === 'true';
      const status = req.query.status;
      const type = req.query.type;

      if (page < 1) page = 1;
      if (limit < 1) limit = 10;
      if (limit > 100) limit = 100;

      const skip = (page - 1) * limit;

      // Build category filter with optional children inclusion
      let categoryFilter = {};
      if (categoryId) {
        const catId = parseInt(categoryId);

        if (includeChildren) {
          // Find all child categories
          const children = await prisma.phycoCategory.findMany({
            where: { parentId: catId },
            select: { id: true },
          });

          // Include parent and all children in filter
          const categoryIds = [catId, ...children.map((c) => c.id)];
          categoryFilter = { categoryId: { in: categoryIds } };
        } else {
          // Filter by single category only
          categoryFilter = { categoryId: catId };
        }
      }

      const where = {
        isDeleted: false,
        ...categoryFilter,
        ...(search && {
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              sku: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        }),
        ...(categoryId && { categoryId: parseInt(categoryId) }),
        ...(status && { status }),
        ...(type && { type }),
      };

      const [products, total] = await Promise.all([
        prisma.phycoProduct.findMany({
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
                slug: true,
              },
            },
            images: {
              orderBy: {
                order: 'asc',
              },
            },
            tags: true,
            attributes: true,
            variations: true,
            _count: {
              select: {
                variations: true,
              },
            },
          },
        }),
        prisma.phycoProduct.count({ where }),
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
      console.error('Error fetching Phyco products:', error);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
  },

  getPhycoProductById: async (req, res) => {
    try {
      const { id } = req.params;

      const product = await prisma.phycoProduct.findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
          category: true,
          author: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
          images: {
            orderBy: {
              order: 'asc',
            },
          },
          tags: true,
          attributes: true,
          variations: {
            orderBy: {
              id: 'asc',
            },
          },
          downloads: true,
        },
      });

      if (!product) {
        return res.status(404).json({ error: 'Phyco product not found' });
      }

      return res.status(200).json(product);
    } catch (error) {
      console.error('Error fetching Phyco product:', error);
      return res.status(500).json({ error: 'Failed to fetch product' });
    }
  },

  updatePhycoProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Update basic product info
      const product = await prisma.phycoProduct.update({
        where: { id: parseInt(id) },
        data: {
          ...(updateData.sku && { sku: updateData.sku }),
          ...(updateData.name && { name: updateData.name }),
          ...(updateData.slug && { slug: updateData.slug }),
          ...(updateData.status && { status: updateData.status }),
          ...(updateData.type && { type: updateData.type }),
          ...(updateData.shortDescription !== undefined && {
            shortDescription: updateData.shortDescription,
          }),
          ...(updateData.description !== undefined && {
            description: updateData.description,
          }),
          ...(updateData.categoryId && {
            categoryId: parseInt(updateData.categoryId),
          }),
          ...(updateData.price !== undefined && {
            price: updateData.price ? parseFloat(updateData.price) : null,
          }),
          ...(updateData.regularPrice !== undefined && {
            regularPrice: updateData.regularPrice
              ? parseFloat(updateData.regularPrice)
              : null,
          }),
          ...(updateData.salePrice !== undefined && {
            salePrice: updateData.salePrice
              ? parseFloat(updateData.salePrice)
              : null,
          }),
          ...(updateData.stockStatus && {
            stockStatus: updateData.stockStatus,
          }),
          ...(updateData.stockQuantity !== undefined && {
            stockQuantity: updateData.stockQuantity
              ? parseInt(updateData.stockQuantity)
              : null,
          }),
          ...(updateData.manageStock !== undefined && {
            manageStock: updateData.manageStock,
          }),
          ...(updateData.featuredImageUrl !== undefined && {
            featuredImageUrl: updateData.featuredImageUrl,
          }),
          ...(updateData.weight !== undefined && { weight: updateData.weight }),
          ...(updateData.taxStatus && { taxStatus: updateData.taxStatus }),
        },
        include: {
          category: true,
          images: true,
          tags: true,
          attributes: true,
          variations: true,
          downloads: true,
        },
      });

      return res.status(200).json(product);
    } catch (error) {
      console.error('Error updating Phyco product:', error);
      return res.status(500).json({ error: 'Failed to update product' });
    }
  },

  deletePhycoProduct: async (req, res) => {
    try {
      const { id } = req.params;

      // Check if product has orders
      const productWithOrders = await prisma.phycoProduct.findUnique({
        where: { id: parseInt(id) },
        include: {
          variations: {
            include: {
              orderItems: true,
            },
          },
        },
      });

      if (!productWithOrders) {
        return res.status(404).json({ error: 'Phyco product not found' });
      }

      const hasOrders = productWithOrders.variations.some(
        (v) => v.orderItems.length > 0
      );

      if (hasOrders) {
        return res.status(400).json({
          error: 'PRODUCT_HAS_ORDERS',
          message:
            'Không thể xóa sản phẩm vì đã có đơn hàng. Vui lòng soft delete thay vì xóa hoàn toàn.',
        });
      }

      // Soft delete
      await prisma.phycoProduct.update({
        where: { id: parseInt(id) },
        data: {
          isDeleted: true,
        },
      });

      return res
        .status(200)
        .json({ message: 'Phyco product deleted successfully' });
    } catch (error) {
      console.error('Error deleting Phyco product:', error);
      return res.status(500).json({ error: 'Failed to delete product' });
    }
  },
};

module.exports = PhycoProductsController;
