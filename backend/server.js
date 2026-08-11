
import 'dotenv/config';
import app from './app.js';
import connectDB from "./src/config/db.js";


// Connect to MongoDB, seed default departments, then start server
connectDB().then(async () => {


  app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
  });
}).catch((err) => {
  console.error("Database connection failed:", err);
});