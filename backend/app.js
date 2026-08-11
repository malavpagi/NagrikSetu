import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';


import errorHandlerMiddleware from './src/middlewares/errorHandlerMiddleware.js';

import authRoutes from "./src/routes/auth.routes.js";
// import adminRoutes from "./src/routes/admin.routes.js"; 
// import citizenRoutes from "./src/routes/citizen.routes.js";
// import officialRouted from "./src/routes/official.routes.js"; 

const app = express();

app.use(helmet());
app.use(cors({
    origin : 'http://localhost:5173',
    credentials : true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended:true }));

app.get("/", (req, res)=>{
    res.send("<h1>Hello World hi</h1>");    
});
app.use('/api/auth', authRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/citizen', citizenRoutes);
// app.use('/api/official', officialRouted);

app.use(errorHandlerMiddleware);

export default app;