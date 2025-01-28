const mongoose = require('mongoose');

const MoodSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Hubungkan ke user
    mood: { type: String, required: true }, // Suasana hati
    description: { type: String, required: false }, 
    date: { type: Date, default: Date.now, required: true }, // Tanggal pencatatan
});

module.exports = mongoose.model('Mood', MoodSchema);
