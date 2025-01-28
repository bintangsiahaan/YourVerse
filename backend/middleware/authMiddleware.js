const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticateUser = async (req, res, next) => {
    const authHeader = req.header('Authorization'); // Ambil Authorization Header

    if (!authHeader) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // Pastikan Header menggunakan format "Bearer <token>"
    const token = authHeader.split(' ')[1]; // Pisahkan 'Bearer' dan token

    if (!token) {
        return res.status(401).json({ error: 'Access denied. Invalid token format.' });
    }

    try {
        // Verifikasi token menggunakan JWT_SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Temukan user berdasarkan ID di token dan tambahkan ke req
        req.user = await User.findById(decoded.id).select('-password');
        next(); // Lanjutkan ke middleware berikutnya
    } catch (error) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};

module.exports = authenticateUser;
