import 'dotenv/config';
import app from './app.js';
import connectDB from "./src/config/db.js";

// MongoDB connection
connectDB();


app.listen(3000, ()=>{
    console.log("http://localhost:3000");
});