const express = require('express');
const router = express.Router();
const Mood = require('../models/mood');
const authenticateUser = require('../middleware/authMiddleware');

// Tambah Mood
router.post('/', authenticateUser, async (req, res) => {
    try {
        const { mood, description } = req.body;

        // Cek apakah mood untuk hari ini sudah dicatat
        const existingMood = await Mood.findOne({
            user: req.user._id,
            date: { $gte: new Date().setHours(0, 0, 0, 0), $lte: new Date().setHours(23, 59, 59, 999) },
        });

        if (existingMood) {
            return res.status(400).json({ error: 'Mood for today is already logged' });
        }

        const newMood = new Mood({
            user: req.user._id,
            mood,
            description,
        });

        const savedMood = await newMood.save();
        res.status(201).json(savedMood);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Dapatkan Riwayat Mood
router.get('/', authenticateUser, async (req, res) => {
    try {
        const moods = await Mood.find({ user: req.user._id })
            .sort('-date')
            .select('mood description date'); // Tambahkan field yang ingin ditampilkan
        res.status(200).json(moods);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Dapatkan Mood untuk Hari Tertentu
router.get('/daily', authenticateUser, async (req, res) => {
    try {
        const { date } = req.query; // Format: YYYY-MM-DD
        if (!date) {
            return res.status(400).json({ error: 'Date is required' });
        }

        const mood = await Mood.findOne({
            user: req.user._id,
            date: { $gte: new Date(date).setHours(0, 0, 0, 0), $lte: new Date(date).setHours(23, 59, 59, 999) },
        }).select('mood description date'); // Tambahkan field yang ingin ditampilkan

        if (!mood) {
            return res.status(404).json({ error: 'No mood logged for this date' });
        }

        res.status(200).json(mood);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Mood
router.put('/:id', authenticateUser, async (req, res) => {
    try {
        const { mood, description } = req.body;

        // Perbarui mood berdasarkan ID dan user
        const updatedMood = await Mood.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { mood, description },
            { new: true } // Mengembalikan dokumen yang diperbarui
        );

        if (!updatedMood) {
            return res.status(404).json({ error: 'Mood not found' });
        }

        res.status(200).json(updatedMood);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete Mood
router.delete('/:id', authenticateUser, async (req, res) => {
    try {
        // Hapus mood berdasarkan ID dan user
        const deletedMood = await Mood.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!deletedMood) {
            return res.status(404).json({ error: 'Mood not found' });
        }

        res.status(200).json({ message: 'Mood deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
