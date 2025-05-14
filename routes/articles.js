const express = require("express");
const router = express.Router();
const Article = require("../models/Article");

// Get all articles
router.get("/", async (req, res) => {
  try {
    const articles = await Article.find().sort({ date: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new article
router.post("/", async (req, res) => {
  const { title, content } = req.body;
  try {
    const article = new Article({ title, content });
    await article.save();
    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
