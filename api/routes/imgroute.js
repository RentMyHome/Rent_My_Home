const express = require('express');
const multer = require('multer');
const path = require('path');
const Image = require('../models/image');
const app = express();
// const port = 3000;

// Set up Multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  }
});

const upload = multer({ storage: storage });

// Define an endpoint for uploading multiple images
app.post('/upload', upload.array('images', 10), async(req, res) => {
  const uploadedFiles = req.files.map(file => ({
    filename: file.filename,
    originalname: file.originalname,
    path: file.path
  }));

  try {
    const savedImages = await Image.insertMany(uploadedFiles);
    const imageIds = savedImages.map(image => image._id);
    res.json({
      message: `Uploaded ${uploadedFiles.length} images successfully!`,
      id : imageIds
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});


// Define an endpoint for fetching a specific image by ID
app.get('/image/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).send('Image not found');
    }
    const currentDir = __dirname;
    const parentDir = path.resolve(currentDir, '../..');
    // console.log(parentDir);
    const imagePath = path.join(parentDir, image.path);
    res.sendFile(imagePath);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = app;
