const prisma = require('../lib/prisma');

const PhycoCategoriesController = {
  createPhycoCategory: async (req, res) => {
    try {
      const { name, slug, description, isActive, parentId } = req.body;

      if (!name || !slug) {
        return res.status(400).json({ error: 'Name and slug are required' });
      }

      const newCategory = await prisma.phycoCategory.create({
        data: {
          name,
          slug,
          description,
          parentId: parentId ? parseInt(parentId) : null,
          isActive: isActive !== undefined ? isActive : true,
        },
        include: {
          parent: {
            select: { id: true, name: true, slug: true },
          },
        },
      });

      res.status(201).json(newCategory);
    } catch (error) {
      console.error('Error creating Phyco category:', error);
      return res.status(400).json({ error: error.message });
    }
  },

  getPhycoCategories: async (req, res) => {
    try {
      let page = parseInt(req.query.page, 10) || 1;
      let limit = parseInt(req.query.limit, 10) || 10;

      const search = req.query.search || '';
      const isActive = req.query.isActive;

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
        ...(isActive !== undefined &&
          isActive !== '' && {
            isActive: isActive === 'true',
          }),
      };

      const [categories, total] = await Promise.all([
        prisma.phycoCategory.findMany({
          skip,
          take: limit,
          where,
          orderBy: [{ parentId: 'asc' }, { id: 'desc' }],
          include: {
            parent: {
              select: { id: true, name: true, slug: true },
            },
            children: {
              select: { id: true, name: true, slug: true },
            },
            _count: {
              select: { products: true },
            },
          },
        }),
        prisma.phycoCategory.count({ where }),
      ]);

      res.json({
        data: categories,
        meta: {
          total,
          page,
          limit,
          pageCount: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error('Error fetching Phyco categories:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getPhycoCategoryById: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await prisma.phycoCategory.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          _count: {
            select: { products: true },
          },
        },
      });

      if (!category) {
        return res.status(404).json({ message: 'Phyco category not found' });
      }

      res.json(category);
    } catch (error) {
      console.error('Error fetching Phyco category:', error);
      return res.status(400).json({ error: error.message });
    }
  },

  updatePhycoCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, slug, description, isActive, parentId } = req.body;

      // Validate không cho category làm parent của chính nó
      if (parentId && parseInt(parentId) === Number(id)) {
        return res.status(400).json({
          error: 'INVALID_PARENT',
          message: 'Category không thể là parent của chính nó',
        });
      }

      const updatedCategory = await prisma.phycoCategory.update({
        where: {
          id: Number(id),
        },
        data: {
          ...(name && { name }),
          ...(slug && { slug }),
          ...(description !== undefined && { description }),
          ...(isActive !== undefined && { isActive }),
          ...(parentId !== undefined && {
            parentId: parentId ? parseInt(parentId) : null,
          }),
        },
        include: {
          parent: {
            select: { id: true, name: true, slug: true },
          },
          children: {
            select: { id: true, name: true, slug: true },
          },
        },
      });

      res.json(updatedCategory);
    } catch (error) {
      console.error('Error updating Phyco category:', error);
      return res.status(400).json({ error: error.message });
    }
  },

  deletePhycoCategory: async (req, res) => {
    try {
      const { id } = req.params;

      // Check if category has products or children
      const categoryWithRelations = await prisma.phycoCategory.findUnique({
        where: { id: Number(id) },
        include: {
          children: true,
          _count: {
            select: { products: true },
          },
        },
      });

      if (!categoryWithRelations) {
        return res.status(404).json({ error: 'Phyco category not found' });
      }

      if (categoryWithRelations.children.length > 0) {
        return res.status(400).json({
          error: 'CATEGORY_HAS_CHILDREN',
          message: `Không thể xóa danh mục vì có ${categoryWithRelations.children.length} danh mục con`,
          children: categoryWithRelations.children.map((c) => c.name),
        });
      }

      if (categoryWithRelations._count.products > 0) {
        return res.status(400).json({
          error: 'CATEGORY_HAS_PRODUCTS',
          message: `Không thể xóa danh mục vì có ${categoryWithRelations._count.products} sản phẩm đang sử dụng`,
        });
      }

      await prisma.phycoCategory.delete({
        where: {
          id: Number(id),
        },
      });

      res.json({ message: 'Phyco category deleted successfully' });
    } catch (error) {
      console.error('Error deleting Phyco category:', error);
      return res.status(400).json({ error: error.message });
    }
  },
};

module.exports = PhycoCategoriesController;
