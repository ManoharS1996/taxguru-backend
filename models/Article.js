const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
  date: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
});

module.exports = mongoose.model("Article", articleSchema);
