const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Article = require('./models/Article');

dotenv.config();
const app = express();

// Middleware
app.use(cors({
  origin: ['https://saitaxfrontend.onrender.com', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
    await initializeSampleData();
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// Initialize sample data
const initializeSampleData = async () => {
  try {
    const count = await Article.countDocuments();
    if (count === 0) {
      const sampleArticles = [
        {
          title: "Understanding Tax Deductions",
          subheading: "Maximize your savings this year",
          content: "Tax deductions can significantly reduce your taxable income...",
          excerpt: "Learn how to maximize your tax deductions...",
          imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f"
        },
        {
          title: "New Tax Laws for 2023",
          subheading: "What's changed and how it affects you",
          content: "The government has introduced several new tax laws...",
          excerpt: "Overview of new tax legislation for 2023...",
          imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85"
        }
      ];
      await Article.insertMany(sampleArticles);
      console.log('Sample articles added successfully');
    }
  } catch (err) {
    console.error('Error initializing sample data:', err);
  }
};

// Routes
app.use('/api/articles', require('./routes/articles'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    error: 'Something went wrong!',
    message: err.message
  });
});

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});