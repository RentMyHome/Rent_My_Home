const express = require('express');
const multer = require('multer');
const path = require('path');
const Image = require('../models/image');
const app = express();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // console.log(__dirname);
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});


const upload = multer({ storage: storage });



app.post('/upload', upload.array('images', 5), async (req, res) => {
  try {
    const files = req.files;
    if (!files) {
      return res.status(400).json({ error: 'Please upload one or more files' });
    }

    const uploadedImages = [];

    for (const file of files) {
      const image = new Image({
        name: file.originalname,
        path: file.path,
        postId: req.body.postId
      });

      const savedImage = await image.save();
      uploadedImages.push(savedImage);
    }

    res.status(200).json({ message: 'Files uploaded and saved to the database', uploadedImages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});


app.get('/images/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;

    if (!postId) {
      return res.status(400).json({ error: 'Please provide a valid postId' });
    }

    const images = await Image.find({ postId });

    res.status(200).json(images);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});











app.delete('/images', async (req, res) => {
  try {
    await Image.deleteMany({});
    res.json({ message: 'All images deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = app;
