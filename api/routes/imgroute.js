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
        uid:req.body.uid,
        name: file.originalname,
        image: {
          data: file.buffer,
          contentType: file.mimetype,
        },
      };
    });

    const savedImages = await Image.insertMany(images);
    const imageIds= await savedImages.map(image => image._id)
    const user = await Image.findOne({ uid: req.body.uid });

    res.json({
      userID: user.uid,
      message: `Uploaded ${images.length} images successfully!`,
      id : imageIds
    });
  }
    catch (error) {
      res.status(500).send(error.message);
    }
});


app.get('/images/:uid', async (req, res) => {
  try {
    const images = await Image.find({ uid: req.params.uid });

    if (!images || images.length === 0) {
      return res.status(404).send('No images found for this uid');
    }

    const responseData = images.map(image => {
      return {
        name: image.name,
        data: image.image.data.toString('base64'),
        contentType: image.image.contentType
      };
    });

    res.send(responseData);
  } catch (err) {
    res.status(500).send(err.message);
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
