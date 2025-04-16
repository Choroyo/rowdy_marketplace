const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());
// Parse JSON body
app.use(express.json());

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, 'client', 'public', 'images', 'products');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`Created directory: ${uploadDir}`);
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Get filename from request body or generate one based on original name
    const filename = req.body.filename || 
                     `${req.body.productId || Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    cb(null, filename);
  }
});

const upload = multer({ storage });

// Single file upload endpoint
app.post('/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Return the public URL path of the uploaded file (not the full system path)
    const publicPath = `/images/products/${req.file.filename}`;
    
    console.log(`File uploaded successfully: ${req.file.filename}`);
    return res.json({
      success: true, 
      filename: req.file.filename,
      path: publicPath
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Multiple files upload endpoint
app.post('/upload-multiple', upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    // Return the public URL paths of all uploaded files
    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      path: `/images/products/${file.filename}`
    }));
    
    console.log(`${req.files.length} files uploaded successfully`);
    return res.json({
      success: true,
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Upload server running on http://localhost:${PORT}`);
  console.log(`Files will be saved to: ${uploadDir}`);
}); 