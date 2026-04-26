const prisma = require('../lib/prisma');
const bcrypt = require('bcrypt');

const UsersControllers = {
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
      }

      // 1. Kiểm tra username hoặc email đã tồn tại chưa
      const existingUser = await prisma.users.findFirst({
        where: {
          OR: [{ email }, { username }],
          isDeleted: false,
        },
      });

      if (existingUser) {
        return res.status(400).json({
          message: existingUser.email === email ? 'Email đã được sử dụng' : 'Tên đăng nhập đã tồn tại',
        });
      }

      // 2. Mã hóa mật khẩu (độ khó 10)
      const hashedPassword = await bcrypt.hash(password, 10);

      // 3. Tạo user mới
      const user = await prisma.users.create({
        data: {
          username,
          email,
          password: hashedPassword,
          role: 'USER', // Mặc định là khách hàng
          isActive: true,
        },
      });

      // 4. Trả về kết quả (loại bỏ mật khẩu)
      const { password: _, ...userWithoutPassword } = user;
      return res.status(201).json({
        message: 'Đăng ký tài khoản thành công',
        user: userWithoutPassword,
      });
    } catch (error) {
      console.error('Register error:', error);
      return res.status(500).json({ message: 'Lỗi hệ thống' });
    }
  },

  getUsers: async (req, res) => {
    try {
      let page = parseInt(req.query.page, 10) || 1;
      let limit = parseInt(req.query.limit, 10) || 10;

      const search = req.query.search || '';
      const role = req.query.role;
      const isActive = req.query.isActive;

      if (page < 1) page = 1;
      if (limit < 1) limit = 10;
      if (limit > 100) limit = 100;

      const skip = (page - 1) * limit;

      const where = {
        isDeleted: false,
        ...(search && {
          OR: [
            { username: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }),
        ...(role && { role }),
        ...(isActive !== undefined &&
          isActive !== '' && {
          isActive: isActive === 'true',
        }),
      };

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          skip,
          take: limit,
          where,
          orderBy: {
            id: 'desc',
          },
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
            // Exclude password for security
          },
        }),
        prisma.user.count({ where }),
      ]);

      res.json({
        data: users,
        meta: {
          total,
          page,
          limit,
          pageCount: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json('Internal Server Error');
    }
  },

  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: {
          id: Number(id),
        },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user || user.isDeleted) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: error.message });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { username, email, password, role, isActive } = req.body;

      const updateData = {
        username,
        email,
        role,
        isActive,
      };

      if (password) {
        updateData.password = password; // Should hash this
      }

      const updatedUser = await prisma.user.update({
        where: {
          id: Number(id),
        },
        data: updateData,
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      res.json(updatedUser);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: error.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      // Soft delete
      await prisma.user.update({
        where: {
          id: Number(id),
        },
        data: {
          isDeleted: true,
          isActive: false,
        },
      });
      res.json({ message: 'Xoá người dùng thành công' });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: error.message });
    }
  },
};

module.exports = UsersControllers;
