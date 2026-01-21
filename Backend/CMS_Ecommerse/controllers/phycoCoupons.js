const prisma = require('../lib/prisma');

const PhycoCouponsController = {
  // Get all coupons with pagination and filtering
  getCoupons: async (req, res) => {
    try {
      let page = parseInt(req.query.page, 10) || 1;
      let limit = parseInt(req.query.limit, 10) || 10;

      const isActive = req.query.isActive;
      const search = req.query.search;

      if (page < 1) page = 1;
      if (limit < 1) limit = 10;
      if (limit > 100) limit = 100;

      const skip = (page - 1) * limit;

      const where = {
        ...(isActive !== undefined && { isActive: isActive === 'true' }),
        ...(search && {
          code: {
            contains: search,
            mode: 'insensitive',
          },
        }),
      };

      const [coupons, total] = await Promise.all([
        prisma.phycoCoupon.findMany({
          skip,
          take: limit,
          where,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        prisma.phycoCoupon.count({ where }),
      ]);

      return res.status(200).json({
        data: coupons,
        meta: {
          total,
          page,
          limit,
          pageCount: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error('Error fetching coupons:', error);
      return res.status(500).json({ error: 'Failed to fetch coupons' });
    }
  },

  // Get single coupon by ID
  getCouponById: async (req, res) => {
    try {
      const { id } = req.params;

      const coupon = await prisma.phycoCoupon.findUnique({
        where: { id: parseInt(id) },
      });

      if (!coupon) {
        return res.status(404).json({ error: 'Coupon not found' });
      }

      return res.status(200).json(coupon);
    } catch (error) {
      console.error('Error fetching coupon:', error);
      return res.status(500).json({ error: 'Failed to fetch coupon' });
    }
  },

  // Create new coupon
  createCoupon: async (req, res) => {
    try {
      const {
        code,
        type,
        value,
        minAmount,
        maxDiscount,
        startDate,
        endDate,
        isActive = true,
        usageLimit,
      } = req.body;

      // Validation
      if (!code || !type || !value || !startDate || !endDate) {
        return res.status(400).json({
          error: 'Code, type, value, startDate, and endDate are required',
        });
      }

      if (!['percentage', 'fixed'].includes(type)) {
        return res.status(400).json({
          error: 'Type must be either "percentage" or "fixed"',
        });
      }

      if (type === 'percentage' && (value < 0 || value > 100)) {
        return res.status(400).json({
          error: 'Percentage value must be between 0 and 100',
        });
      }

      if (value <= 0) {
        return res.status(400).json({
          error: 'Value must be greater than 0',
        });
      }

      // Check if coupon code already exists
      const existingCoupon = await prisma.phycoCoupon.findUnique({
        where: { code },
      });

      if (existingCoupon) {
        return res.status(400).json({
          error: 'Coupon code already exists',
        });
      }

      // Validate dates
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (end <= start) {
        return res.status(400).json({
          error: 'End date must be after start date',
        });
      }

      // Create coupon
      const coupon = await prisma.phycoCoupon.create({
        data: {
          code,
          type,
          value,
          minAmount,
          maxDiscount,
          startDate: start,
          endDate: end,
          isActive,
          usageLimit,
          usedCount: 0,
        },
      });

      return res.status(201).json(coupon);
    } catch (error) {
      console.error('Error creating coupon:', error);
      return res.status(500).json({ error: 'Failed to create coupon' });
    }
  },

  // Update coupon
  updateCoupon: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        code,
        type,
        value,
        minAmount,
        maxDiscount,
        startDate,
        endDate,
        isActive,
        usageLimit,
      } = req.body;

      // Check if coupon exists
      const existingCoupon = await prisma.phycoCoupon.findUnique({
        where: { id: parseInt(id) },
      });

      if (!existingCoupon) {
        return res.status(404).json({ error: 'Coupon not found' });
      }

      // If updating code, check for duplicates
      if (code && code !== existingCoupon.code) {
        const duplicateCoupon = await prisma.phycoCoupon.findUnique({
          where: { code },
        });

        if (duplicateCoupon) {
          return res.status(400).json({
            error: 'Coupon code already exists',
          });
        }
      }

      // Validate type if provided
      if (type && !['percentage', 'fixed'].includes(type)) {
        return res.status(400).json({
          error: 'Type must be either "percentage" or "fixed"',
        });
      }

      // Validate percentage value
      if (
        (type === 'percentage' || existingCoupon.type === 'percentage') &&
        value !== undefined &&
        (value < 0 || value > 100)
      ) {
        return res.status(400).json({
          error: 'Percentage value must be between 0 and 100',
        });
      }

      // Validate value
      if (value !== undefined && value <= 0) {
        return res.status(400).json({
          error: 'Value must be greater than 0',
        });
      }

      // Validate dates if both are provided
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (end <= start) {
          return res.status(400).json({
            error: 'End date must be after start date',
          });
        }
      }

      // Build update data
      const updateData = {};
      if (code !== undefined) updateData.code = code;
      if (type !== undefined) updateData.type = type;
      if (value !== undefined) updateData.value = value;
      if (minAmount !== undefined) updateData.minAmount = minAmount;
      if (maxDiscount !== undefined) updateData.maxDiscount = maxDiscount;
      if (startDate !== undefined) updateData.startDate = new Date(startDate);
      if (endDate !== undefined) updateData.endDate = new Date(endDate);
      if (isActive !== undefined) updateData.isActive = isActive;
      if (usageLimit !== undefined) updateData.usageLimit = usageLimit;

      // Update coupon
      const coupon = await prisma.phycoCoupon.update({
        where: { id: parseInt(id) },
        data: updateData,
      });

      return res.status(200).json(coupon);
    } catch (error) {
      console.error('Error updating coupon:', error);
      return res.status(500).json({ error: 'Failed to update coupon' });
    }
  },

  // Delete coupon
  deleteCoupon: async (req, res) => {
    try {
      const { id } = req.params;

      // Check if coupon exists
      const existingCoupon = await prisma.phycoCoupon.findUnique({
        where: { id: parseInt(id) },
      });

      if (!existingCoupon) {
        return res.status(404).json({ error: 'Coupon not found' });
      }

      // Delete the coupon
      await prisma.phycoCoupon.delete({
        where: { id: parseInt(id) },
      });

      return res.status(200).json({
        message: 'Coupon deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting coupon:', error);
      return res.status(500).json({ error: 'Failed to delete coupon' });
    }
  },

  // Toggle coupon active status
  toggleCouponStatus: async (req, res) => {
    try {
      const { id } = req.params;

      // Get current coupon
      const existingCoupon = await prisma.phycoCoupon.findUnique({
        where: { id: parseInt(id) },
      });

      if (!existingCoupon) {
        return res.status(404).json({ error: 'Coupon not found' });
      }

      // Toggle the status
      const coupon = await prisma.phycoCoupon.update({
        where: { id: parseInt(id) },
        data: {
          isActive: !existingCoupon.isActive,
        },
      });

      return res.status(200).json(coupon);
    } catch (error) {
      console.error('Error toggling coupon status:', error);
      return res.status(500).json({ error: 'Failed to toggle coupon status' });
    }
  },
};

module.exports = PhycoCouponsController;
