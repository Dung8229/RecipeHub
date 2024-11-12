const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Đường dẫn thư mục lưu trữ ảnh
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Tạo tên file với hậu tố unique
    }
});

// Tạo instance của multer với cấu hình lưu trữ
const upload = multer({ storage: storage });

module.exports = { upload }
