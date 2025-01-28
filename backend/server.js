const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // Tambahkan untuk middleware static
const connectDB = require('./config/db');
const photosRoute = require('./routes/photosRoute');
const musicRoutes = require('./routes/musicRoute');
const authRoute = require('./routes/authRoute'); 
const authenticateUser = require('./middleware/authMiddleware'); 
const eventRoute = require('./routes/eventRoute');
const moodRoute = require('./routes/moodRoute');
const quoteRoute = require('./routes/quoteRoute');

require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.json());

// Middleware CORS dengan konfigurasi
const corsOptions = {
    origin: 'http://localhost:3001', // Ganti sesuai URL frontend Anda
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Metode yang diizinkan
    credentials: true, // Jika menggunakan cookies atau header khusus
};
app.use(cors(corsOptions));

// Middleware Static untuk melayani file di folder uploads/images
app.use('/uploads/images', express.static(path.join(__dirname, 'uploads/images')));
app.use('/uploads/music', express.static(path.join(__dirname, 'uploads/music')));

// Connect to DB
connectDB();

// Routes
app.use('/api/auth', authRoute); 
app.use('/api/photos', authenticateUser, photosRoute); 
app.use('/api/music', authenticateUser, musicRoutes); 
app.use('/api/events', eventRoute);
app.use('/api/moods', moodRoute);
app.use('/api/quotes', quoteRoute);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
