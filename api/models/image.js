const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  name: String,
  path: String,
  postId: String
});
module.exports = mongoose.model('Image', imageSchema);
