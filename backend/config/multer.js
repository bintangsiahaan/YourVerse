const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Periksa jenis file untuk menentukan folder penyimpanan
        if (file.mimetype.startsWith('image/')) {
            cb(null, 'uploads/images'); // Folder untuk gambar
        } else if (file.mimetype.startsWith('audio/')) {
            cb(null, 'uploads/music'); // Folder untuk musik
        } else {
            cb(new Error('Invalid file type'), false);
        }
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Nama file unik
    },
});

const fileFilter = (req, file, cb) => {
    // Format ekstensi file yang diperbolehkan
    const allowedExtensions = /jpeg|jpg|png|gif|mp3|wav|ogg/;
    const extName = allowedExtensions.test(path.extname(file.originalname).toLowerCase());

    // MIME type yang diperbolehkan
    const allowedMimeTypes = /image\/jpeg|image\/png|image\/gif|audio\/mpeg|audio\/wav|audio\/ogg/;
    const mimeType = allowedMimeTypes.test(file.mimetype);

    if (extName && mimeType) {
        cb(null, true); // File diterima
    } else {
        cb(new Error('Only images and audio files are allowed!')); // File ditolak
    }
};



// Middleware Multer
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // Batas ukuran file (10 MB)
});

module.exports = upload;
