const express = require('express');
const router = express.Router();
const Article = require('../models/Article');

// Get all articles
router.get('/', async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const query = search ? {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const articles = await Article.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v'); // Exclude __v field

    const count = await Article.countDocuments(query);

    res.json({
      success: true,
      data: articles,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page)
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// Get single article
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).select('-__v'); // Exclude __v field

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }

    res.json({
      success: true,
      data: article
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// Create new article
router.post('/', async (req, res) => {
  try {
    const { title, content, excerpt, subheading, imageUrl, category } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: 'Title and content are required'
      });
    }

    const newArticle = new Article({
      title,
      content,
      excerpt: excerpt || `${content.substring(0, 150)}...`,
      subheading: subheading || '',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      category: category || 'General'
    });

    const savedArticle = await newArticle.save();

    res.status(201).json({
      success: true,
      data: savedArticle
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

module.exports = router;