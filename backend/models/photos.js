const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    filePath: { type: String, required: true }, 
    createdAt: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Photo', PhotoSchema);
