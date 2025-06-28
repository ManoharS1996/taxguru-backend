const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("MongoDB connected successfully");
  initializeSampleData(); // Add sample articles if none exist
})
.catch((err) => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});

// Sample data insert
async function initializeSampleData() {
  try {
    const Article = require("./models/Article");
    const count = await Article.countDocuments();

    if (count === 0) {
      const sampleArticles = [
        {
          title: "First Article",
          subheading: "Introduction to Tax Planning",
          content: "This is the full content of the first article about tax planning strategies...",
          excerpt: "Learn about basic tax planning strategies...",
        },
        {
          title: "Second Article",
          subheading: "Advanced Tax Deductions",
          content: "This article covers advanced tax deduction techniques for businesses...",
          excerpt: "Discover advanced tax deduction methods...",
        },
      ];
      await Article.insertMany(sampleArticles);
      console.log("Sample articles added successfully");
    }
  } catch (err) {
    console.error("Error initializing sample data:", err);
  }
}

// Routes
app.use("/api/articles", require("./routes/articles"));

// Test endpoint
app.get("/", (req, res) => {
  res.send("API is running");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
