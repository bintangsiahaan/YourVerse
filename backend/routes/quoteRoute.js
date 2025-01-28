const express = require('express');
const router = express.Router();
const Quote = require('../models/quote');

// Tambah Quote Baru
router.post('/', async (req, res) => {
    try {
        const { text, author } = req.body;

        const newQuote = new Quote({
            text,
            author,
        });

        const savedQuote = await newQuote.save();
        res.status(201).json(savedQuote);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Dapatkan Quotes Acak
router.get('/daily', async (req, res) => {
    try {
        const count = await Quote.countDocuments();
        const randomIndex = Math.floor(Math.random() * count);
        const randomQuote = await Quote.findOne().skip(randomIndex);

        res.status(200).json(randomQuote);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Dapatkan Semua Quotes
router.get('/', async (req, res) => {
    try {
        const quotes = await Quote.find();
        res.status(200).json(quotes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Quote
router.put('/:id', async (req, res) => {
    try {
        const { text, author } = req.body;

        // Update quote berdasarkan ID
        const updatedQuote = await Quote.findByIdAndUpdate(
            req.params.id,
            { text, author },
            { new: true } // Mengembalikan dokumen yang diperbarui
        );

        if (!updatedQuote) {
            return res.status(404).json({ error: 'Quote not found' });
        }

        res.status(200).json(updatedQuote);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete Quote
router.delete('/:id', async (req, res) => {
    try {
        // Hapus quote berdasarkan ID
        const deletedQuote = await Quote.findByIdAndDelete(req.params.id);

        if (!deletedQuote) {
            return res.status(404).json({ error: 'Quote not found' });
        }

        res.status(200).json({ message: 'Quote deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
