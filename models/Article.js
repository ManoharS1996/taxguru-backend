const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subheading: { type: String, default: "" },
  content: { type: String, required: true },
  excerpt: { type: String, default: "" },
  date: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
});

module.exports = mongoose.model("Article", articleSchema);
