const express = require('express');
const multer = require('multer');
const path = require('path');
const Image = require('../models/image');
const app = express();
// const port = 3000;
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Routes
app.post('/upload', upload.array('images', 10), async (req, res) => {
  try {
    const images = req.files.map((file) => {
      return {
        name: file.originalname,
        image: {
          data: file.buffer,
          contentType: file.mimetype,
        },
      };
    });

    const savedImages = await Image.insertMany(images);
    const imageIds= await savedImages.map(image => image._id);
    res.json({
      message: `Uploaded ${images.length} images successfully!`,
      id : imageIds
    });
  }
    catch (error) {
      res.status(500).send(error.message);
    }
});


// Define an endpoint for fetching a specific image by ID
app.get('/images/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.set('Content-Type', image.image.contentType);
    res.send(image.image.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = app;
