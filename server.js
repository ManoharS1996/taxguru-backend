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
          content: "Tax deductions can significantly reduce your taxable income. Here are the key deductions you should know about:\n\n1. Standard Deduction: For 2023, the standard deduction is $13,850 for single filers and $27,700 for married couples filing jointly.\n\n2. Itemized Deductions: These include medical expenses, state and local taxes, mortgage interest, and charitable contributions.\n\n3. Above-the-Line Deductions: These reduce your adjusted gross income and include contributions to retirement accounts and student loan interest.",
          excerpt: "Learn how to maximize your tax deductions and reduce your taxable income.",
          imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f"
        },
        {
          title: "New Tax Laws for 2023",
          subheading: "What's changed and how it affects you",
          content: "The government has introduced several new tax laws that will impact your 2023 filings:\n\n• Increased standard deductions\n• Changes to retirement account contribution limits\n• New energy efficiency tax credits\n• Modified child tax credit amounts\n\nMake sure to consult with a tax professional to understand how these changes affect your specific situation.",
          excerpt: "Overview of new tax legislation for 2023 and how it might impact your filings.",
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