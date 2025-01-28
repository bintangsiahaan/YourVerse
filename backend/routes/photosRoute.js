const express = require('express');
const router = express.Router();
const Photo = require('../models/photos');
const upload = require('../config/multer');
const authenticateUser = require('../middleware/authMiddleware');
const fs = require('fs');
const path = require('path');

// Endpoint untuk upload foto
router.post('/', authenticateUser, upload.single('image'), async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const newPhoto = new Photo({
            title,
            description,
            filePath: req.file.filename,
            user: req.user._id, 
        });

        const savedPhoto = await newPhoto.save();
        res.status(201).json(savedPhoto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint untuk mendapatkan semua foto pengguna yang sedang login
router.get('/', authenticateUser, async (req, res) => {
    try {
        const photos = await Photo.find({ user: req.user._id });
        res.status(200).json(photos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint untuk menghapus foto berdasarkan ID
router.delete('/:id', authenticateUser, async (req, res) => {
    try {
        const photo = await Photo.findOneAndDelete({ _id: req.params.id, user: req.user._id });

        if (!photo) {
            return res.status(404).json({ error: 'Photo not found or not authorized' });
        }

        const filePath = path.join(__dirname, '../uploads/images', photo.filePath);

        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                }
            });
        }

        res.status(200).json({ message: 'Photo deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
