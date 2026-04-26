const express = require('express');
const router = express.Router();
const { uploadCloud, cloudinary } = require('../lib/cloudinary');

// Route upload 1 ảnh
router.post('/api/upload', uploadCloud.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ 
        imageUrl: req.file.path,
        publicId: req.file.filename // Đây là publicId trên Cloudinary
    });
});

// Route xóa ảnh trên Cloudinary
router.delete('/api/upload', async (req, res) => {
    try {
        const { publicId } = req.body;
        if (!publicId) return res.status(400).json({ error: 'publicId is required' });
        
        const result = await cloudinary.uploader.destroy(publicId);
        res.json({ message: 'Deleted successfully', result });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete image' });
    }
});

// Route upload nhiều ảnh cùng lúc
router.post('/api/uploads', uploadCloud.array('images', 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
    }
    const images = req.files.map(file => ({
        imageUrl: file.path,
        publicId: file.filename
    }));
    res.json({ images });
});

module.exports = router;
