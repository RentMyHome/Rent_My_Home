const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  uid:String,
  name: String,
  image: {
    data: Buffer,
    contentType: String
  }
});
module.exports = mongoose.model('Image', imageSchema);
