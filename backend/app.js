const express = require('express');
const dot_env = require('dotenv');
const session = require('express-session');
const connectDb = require('./app/config/db');
const cors = require('cors');  
const app = express();
dot_env.config();
connectDb();
app.use(cors());


app.use(express.static(__dirname + '/public'));


app.use(express.static('/uploads'));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // For JSON bodies


// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET, // Secret from .env file
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create a session until something is stored
    cookie: { secure: false } // Set to true if using HTTPS
}));


const authRouter = require('./app/router/api/AuthRoutes');

app.use('/api',authRouter);


const PORT = process.env.PORT || 5200;

app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
    
})