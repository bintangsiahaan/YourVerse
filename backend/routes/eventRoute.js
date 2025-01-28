const express = require('express');
const router = express.Router();
const Event = require('../models/event');
const authenticateUser = require('../middleware/authMiddleware');

// Tambah Event
router.post('/', authenticateUser, async (req, res) => {
    try {
        const { title, description, date, time, isImportant } = req.body;

        const newEvent = new Event({
            user: req.user._id, // Hubungkan ke pengguna login
            title,
            description,
            date,
            time,
            isImportant,
        });

        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Dapatkan Semua Event
router.get('/', authenticateUser, async (req, res) => {
    try {
        const events = await Event.find({ user: req.user._id }).sort('date'); // Event milik pengguna login
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Dapatkan Event Berdasarkan Hari
router.get('/daily', authenticateUser, async (req, res) => {
    try {
        const { date } = req.query; // Format: YYYY-MM-DD
        if (!date) {
            return res.status(400).json({ error: 'Date is required' });
        }

        const events = await Event.find({
            user: req.user._id,
            date: new Date(date),
        });
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Dapatkan Event Berdasarkan Minggu
router.get('/weekly', authenticateUser, async (req, res) => {
    try {
        const { startDate, endDate } = req.query; // Format: YYYY-MM-DD
        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'Start date and end date are required' });
        }

        const events = await Event.find({
            user: req.user._id,
            date: { $gte: new Date(startDate), $lte: new Date(endDate) },
        }).sort('date');
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Event
router.put('/:id', authenticateUser, async (req, res) => {
    try {
        const updatedEvent = await Event.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Hapus Event
router.delete('/:id', authenticateUser, async (req, res) => {
    try {
        const deletedEvent = await Event.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!deletedEvent) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
