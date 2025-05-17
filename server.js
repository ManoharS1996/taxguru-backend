const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// MongoDB Connection with improved error handling
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("MongoDB connected successfully");
  // Initialize sample data if needed
  initializeSampleData();
})
.catch((err) => {
  console.error("MongoDB connection error:", err);
  process.exit(1); // Exit process with failure
});

// Sample data initialization function
async function initializeSampleData() {
  try {
    const Article = require("./models/Article");
    const count = await Article.countDocuments();
    
    if (count === 0) {
      const sampleArticles = [
        { title: "First Article", content: "This is the content of the first article" },
        { title: "Second Article", content: "This is the content of the second article" },
        { title: "Third Article", content: "This is the content of the third article" }
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

// Basic route for testing
app.get("/", (req, res) => {
  res.send("API is running");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`MongoDB URI: ${process.env.MONGO_URI}`);
});