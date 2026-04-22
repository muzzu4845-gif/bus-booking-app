// server.js — Entry point: connects to DB, then starts Express server
// Keep this file clean — only startup logic here
const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

// Connect to MongoDB, then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
