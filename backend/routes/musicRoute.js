const express = require('express');
const router = express.Router();
const Music = require('../models/music');
const musicUpload = require('../config/multer');
const authenticateUser = require('../middleware/authMiddleware');
const fs = require('fs');
const path = require('path');

// Endpoint untuk upload musik
router.post('/', authenticateUser, musicUpload.single('audio'), async (req, res) => {
    try {
        const { title, artist, album } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: 'No audio file uploaded' });
        }

        const newMusic = new Music({
            title,
            artist,
            album,
            filePath: req.file.filename,
            user: req.user._id,
        });

        const savedMusic = await newMusic.save();
        res.status(201).json(savedMusic);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint untuk mendapatkan semua musik pengguna yang sedang login
router.get('/', authenticateUser, async (req, res) => {
    try {
        const musicList = await Music.find({ user: req.user._id });
        res.status(200).json(musicList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint untuk menghapus musik berdasarkan ID
router.delete('/:id', authenticateUser, async (req, res) => {
    try {
        const music = await Music.findOneAndDelete({ _id: req.params.id, user: req.user._id });

        if (!music) {
            return res.status(404).json({ error: 'Music not found or not authorized' });
        }

        const filePath = path.join(__dirname, '../uploads/music/', music.filePath);

        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                } else {
                    console.log('File deleted successfully:', filePath);
                }
            });
        }

        res.status(200).json({ message: 'Music deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
