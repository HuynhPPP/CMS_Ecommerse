const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Cấu hình thông tin tài khoản Cloudinary của bạn
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Thiết lập nơi lưu trữ trên Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'cms_ecommerce', // Tên thư mục trên Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'avif', 'gif'],
    }
});

const uploadCloud = multer({ storage });

module.exports = { uploadCloud, cloudinary };
