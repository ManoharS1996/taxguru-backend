const express = require("express");
const router = express.Router();
const Article = require("../models/Article");

// Get all articles (with optional search)
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } }
        ]
      };
    }

    const articles = await Article.find(query).sort({ date: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single article by ID
router.get("/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    // Increment view count
    article.views += 1;
    await article.save();

    res.json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new article
router.post("/", async (req, res) => {
  try {
    const { title, subheading, content, excerpt } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const article = new Article({
      title,
      subheading,
      content,
      excerpt: excerpt || content.substring(0, 100) + "...",
    });

    await article.save();
    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
