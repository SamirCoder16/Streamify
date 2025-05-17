import 'dotenv/config'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import express from 'express';
import morgan from 'morgan'
import path from 'path'

// PORT configeration
const PORT = process.env.PORT || 3000;

const __dirname = path.resolve();

// Import MongoDB and connect to Server to Running .
import { connectDB } from './lib/db.js'



// Imports Routes from routes folder in src module .
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js'
import chatRoutes from './routes/chat.route.js'



// Create App using express;
const app = express();

//  All Middlewares .
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true // allow frontend to send the cookies
}));

// API Endpoints
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/chat', chatRoutes)

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, "../Frontend/dist")));

    app.get("*", (req,res)=> {
        res.sendFile(path.join(__dirname,  "../Frontend", "dist", "index.html"))
    })
}
// Listen the Server .
app.listen(PORT, ()=>{
    console.log(`server is running on port ============> ${PORT}`);
    connectDB();
})