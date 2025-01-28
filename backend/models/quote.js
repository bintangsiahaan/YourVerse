const mongoose = require('mongoose');

const QuoteSchema = new mongoose.Schema({
    text: { type: String, required: true }, // Teks kutipan
    author: { type: String, default: 'Anonymous' }, // Penulis kutipan
});

module.exports = mongoose.model('Quote', QuoteSchema);
