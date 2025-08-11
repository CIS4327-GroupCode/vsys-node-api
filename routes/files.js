// routes/files.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const fileController = require('../controllers/fileController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/'); // Store files in the 'public' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.username}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });

router.post('/upload', auth, upload.single('document'), fileController.uploadFile);

module.exports = router;