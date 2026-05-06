const prisma = require('../lib/prisma');

const searchController = {
  searchAll: async (req, res) => {
    const { q, category, minPrice, maxPrice, sort, page = 1, limit = 10 } = req.query;
    try {
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const take = parseInt(limit);

      const where = {
        isDeleted: false,
        AND: []
      };

      if (q) {
        where.AND.push({
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } }
          ]
        });
      }

      if (category) {
        where.AND.push({
          category: {
            name: category
          }
        });
      }

      if (minPrice || maxPrice) {
        const priceFilter = {};
        if (minPrice) priceFilter.gte = parseFloat(minPrice);
        if (maxPrice) priceFilter.lte = parseFloat(maxPrice);
        
        where.AND.push({
          colors: {
            some: {
              variants: {
                some: {
                  price: priceFilter
                }
              }
            }
          }
        });
      }

      if (where.AND.length === 0) delete where.AND;

      // Note: Sorting by nested price is complex in Prisma. 
      // For now, we sort by createdAt as default. 
      // In production, you might want to denormalize a 'minPrice' field to the Products table.
      let orderBy = { createdAt: 'desc' };
      
      // If price sorting is requested, we will handle it via JS after fetching if necessary, 
      // but for basic DB search, we use createdAt.
      if (sort === 'latest') orderBy = { createdAt: 'desc' };

      const [total, results] = await Promise.all([
        prisma.products.count({ where }),
        prisma.products.findMany({
          where,
          include: {
            category: true,
            colors: {
              include: {
                variants: true,
                images: true
              }
            }
          },
          orderBy,
          skip,
          take
        })
      ]);

      // Simple JS Sort for price if needed (only for the current page)
      if (sort === 'price_asc' || sort === 'price_desc') {
        results.sort((a, b) => {
          const priceA = a.colors[0]?.variants[0]?.price || 0;
          const priceB = b.colors[0]?.variants[0]?.price || 0;
          return sort === 'price_asc' ? priceA - priceB : priceB - priceA;
        });
      }

      res.json({
        total,
        results
      });
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ message: 'Lỗi tìm kiếm tổng hợp' });
    }
  },

  searchByPrice: async (req, res) => {
    const { min, max, page = 1, limit = 10 } = req.query;
    try {
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const take = parseInt(limit);

      const where = {
        isDeleted: false,
        colors: {
          some: {
            variants: {
              some: {
                price: {
                  gte: parseFloat(min) || 0,
                  lte: parseFloat(max) || 999999999
                }
              }
            }
          }
        }
      };

      const [total, results] = await Promise.all([
        prisma.products.count({ where }),
        prisma.products.findMany({
          where,
          include: {
            category: true,
            colors: { include: { variants: true, images: true } }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take
        })
      ]);

      res.json({ total, results });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi lọc theo giá' });
    }
  },

  searchByDate: async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const take = parseInt(limit);

      const where = { isDeleted: false };

      const [total, results] = await Promise.all([
        prisma.products.count({ where }),
        prisma.products.findMany({
          where,
          include: {
            category: true,
            colors: { include: { variants: true, images: true } }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take
        })
      ]);

      res.json({ total, results });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi lấy sản phẩm mới nhất' });
    }
  }
};

module.exports = searchController;
