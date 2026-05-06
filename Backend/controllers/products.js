const prisma = require('../lib/prisma');

const sanitizeProductData = (data) => {
  const { name, description, categoryId, colors } = data;

  return {
    name: name?.trim() || '',
    description: description?.trim() || '',
    categoryId: parseInt(categoryId, 10),
    moreDetails: data.moreDetails || [],
    sizeAndFit: data.sizeAndFit || [],
    guarantee: data.guarantee?.trim() || '',
    sizeChartImage: data.sizeChartImage || '',
    colors: (colors || [])
      .filter(c => c.color && c.color.trim() !== '') // Chỉ lấy màu có tên hợp lệ
      .map(c => ({
        color: c.color.trim(),
        colorCode: c.colorCode || '#000000',
        images: (c.images || [])
          .filter(img => img.imageUrl)
          .map((img, idx) => ({
            imageUrl: typeof img.imageUrl === 'object' ? img.imageUrl.imageUrl : img.imageUrl,
            order: idx
          })),
        variants: (c.variants || [])
          .filter(v => v.size) // Chỉ lấy biến thể có size
          .map(v => ({
            size: v.size.trim(),
            price: parseFloat(v.price) || 0,
            stock: parseInt(v.stock, 10) || 0
          }))
      }))
  };
};

const productsController = {
  // 1. TẠO MỚI SẢN PHẨM
  createProduct: async (req, res) => {
    try {
      const sanitized = sanitizeProductData(req.body);

      // Kiểm tra các trường bắt buộc
      if (!sanitized.name) return res.status(400).json({ message: 'Tên sản phẩm không được để trống' });
      if (isNaN(sanitized.categoryId)) return res.status(400).json({ message: 'Danh mục không hợp lệ' });

      // Kiểm tra danh mục có tồn tại không
      const category = await prisma.category.findUnique({ where: { id: sanitized.categoryId } });
      if (!category) return res.status(400).json({ message: 'Danh mục sản phẩm không tồn tại' });

      const product = await prisma.products.create({
        data: {
          name: sanitized.name,
          description: sanitized.description,
          category: { connect: { id: sanitized.categoryId } },
          moreDetails: sanitized.moreDetails,
          sizeAndFit: sanitized.sizeAndFit,
          guarantee: sanitized.guarantee,
          sizeChartImage: sanitized.sizeChartImage,
          colors: {
            create: sanitized.colors.map(c => ({
              color: c.color,
              colorCode: c.colorCode,
              images: { create: c.images },
              variants: { create: c.variants }
            }))
          }
        },
        include: {
          colors: { include: { variants: true, images: true } }
        }
      });

      return res.status(201).json(product);
    } catch (error) {
      console.error('Error creating product:', error);
      return res.status(500).json({ message: 'Lỗi hệ thống khi tạo sản phẩm', error: error.message });
    }
  },

  // 2. LẤY DANH SÁCH SẢN PHẨM (Đã tối ưu phân trang & tìm kiếm)
  getProducts: async (req, res) => {
    try {
      let page = parseInt(req.query.page, 10) || 1;
      let limit = req.query.limit === 'all' ? 'all' : (parseInt(req.query.limit, 10) || 10);

      const search = req.query.search?.trim() || '';
      const categoryId = parseInt(req.query.categoryId, 10) || undefined;
      const sortType = req.query.sortType || '0';

      const where = {
        isDeleted: false,
        ...(search && { name: { contains: search, mode: 'insensitive' } }),
        ...(categoryId && { categoryId })
      };

      let orderBy = { id: 'desc' };
      if (sortType === '3') orderBy = { createdAt: 'desc' };

      const [products, total] = await Promise.all([
        prisma.products.findMany({
          skip: limit === 'all' ? undefined : (page - 1) * limit,
          take: limit === 'all' ? undefined : limit,
          where,
          orderBy,
          include: {
            category: { select: { id: true, name: true } },
            colors: { include: { variants: true, images: true } }
          }
        }),
        prisma.products.count({ where })
      ]);

      return res.status(200).json({
        data: products,
        meta: { total, page, limit, pageCount: limit === 'all' ? 1 : Math.ceil(total / limit) }
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      return res.status(500).json({ message: 'Lỗi khi lấy danh sách sản phẩm' });
    }
  },

  // 3. CẬP NHẬT SẢN PHẨM (Sử dụng Transaction an toàn)
  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const productId = parseInt(id, 10);
      const sanitized = sanitizeProductData(req.body);

      if (isNaN(productId)) return res.status(400).json({ message: 'ID sản phẩm không hợp lệ' });

      // Kiểm tra sản phẩm có tồn tại không
      const existingProduct = await prisma.products.findUnique({ where: { id: productId } });
      if (!existingProduct) return res.status(404).json({ message: 'Sản phẩm không tồn tại' });

      const result = await prisma.$transaction(async (tx) => {
        // Cập nhật thông tin cơ bản
        await tx.products.update({
          where: { id: productId },
          data: {
            name: sanitized.name,
            description: sanitized.description,
            category: { connect: { id: sanitized.categoryId } },
            moreDetails: sanitized.moreDetails,
            sizeAndFit: sanitized.sizeAndFit,
            guarantee: sanitized.guarantee,
            sizeChartImage: sanitized.sizeChartImage
          }
        });

        // Nếu có gửi danh sách màu sắc, thực hiện đồng bộ lại
        if (req.body.colors) {
          // Xóa các màu cũ không có trong danh sách mới (Logic đơn giản hóa cho độ tin cậy cao)
          // Lưu ý: Trong thực tế bạn có thể dùng logic update từng cái, nhưng xóa-tạo lại là cách an toàn nhất để tránh rác dữ liệu
          await tx.productColor.deleteMany({ where: { productId } });

          // Tạo lại bộ màu sắc, biến thể và ảnh mới
          for (const c of sanitized.colors) {
            await tx.productColor.create({
              data: {
                productId,
                color: c.color,
                colorCode: c.colorCode,
                images: { create: c.images },
                variants: { create: c.variants }
              }
            });
          }
        }
        return await tx.products.findUnique({
          where: { id: productId },
          include: { colors: { include: { variants: true, images: true } } }
        });
      });

      return res.status(200).json(result);
    } catch (error) {
      console.error('Error updating product:', error);
      return res.status(500).json({ message: 'Lỗi khi cập nhật sản phẩm', error: error.message });
    }
  },

  // 4. LẤY CHI TIẾT SẢN PHẨM
  getProductById: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await prisma.products.findUnique({
        where: { id: parseInt(id, 10), isDeleted: false },
        include: {
          category: { select: { id: true, name: true } },
          colors: { include: { images: { orderBy: { order: 'asc' } }, variants: true } }
        }
      });
      if (!product) return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
      return res.status(200).json(product);
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi khi lấy chi tiết sản phẩm' });
    }
  },

  // 5. XÓA SẢN PHẨM (Soft Delete)
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.products.update({
        where: { id: parseInt(id, 10) },
        data: { isDeleted: true }
      });
      return res.status(200).json({ message: 'Xóa sản phẩm thành công' });
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi khi xóa sản phẩm' });
    }
  },

  // 6. LẤY SẢN PHẨM LIÊN QUAN
  getRelatedProducts: async (req, res) => {
    try {
      const { id } = req.params;
      const productId = parseInt(id, 10);

      const product = await prisma.products.findUnique({ where: { id: productId } });
      if (!product) return res.status(404).json({ message: 'Sản phẩm không tồn tại' });

      const related = await prisma.products.findMany({
        where: {
          categoryId: product.categoryId,
          id: { not: productId },
          isDeleted: false
        },
        take: 4, // Lấy 4 sản phẩm liên quan
        include: {
          category: { select: { id: true, name: true } },
          colors: { include: { variants: true, images: true } }
        }
      });
      return res.status(200).json(related);
    } catch (error) {
      console.error('Error fetching related products:', error);
      return res.status(500).json({ message: 'Lỗi khi lấy sản phẩm liên quan' });
    }
  }
};

module.exports = productsController;
