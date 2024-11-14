const multer = require('multer');
const path = require('path');

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Use an absolute path for uploads
        cb(null, path.join(__dirname, '../../uploads/'));
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        // Save file with timestamp and extension
        cb(null, Date.now() + ext);
    }
});

// Set up multer for image upload
const uploadUserImage = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Validate file types
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
            cb(null, true);
        } else {
            // Pass an error for unsupported file types
            cb(new Error('Only jpg, jpeg, and png files are supported!'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB file size limit
    }
});

// Handle file upload errors
uploadUserImage.single('image'), function (err, req, res, next) {
    if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        return res.status(400).send(err.message);
    } else if (err) {
        // An unknown error occurred
        return res.status(400).send(err.message);
    }
    next();
};

module.exports = uploadUserImage;