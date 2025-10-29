const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();
const PORT = 8080;


const app = express();


app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Static files serving
app.use(express.static(path.join(__dirname, 'public'))); 
app.use(express.static(path.join(__dirname, 'css')));   
app.use(express.static(path.join(__dirname, 'js')));    
app.use(express.static(path.join(__dirname, 'Image'))); 
app.use(express.static(path.join(__dirname, 'html')));  
app.use('/Uploads', express.static(path.join(__dirname, 'Uploads'))); 

const router = express.Router();


router.get('/', (req, res) => {
    console.log("Request at " + req.url);
    res.sendFile(path.join(__dirname, 'html', 'HomePage.html'));
});

router.get('/teammember', (req, res) => {
    console.log("Request at " + req.url);
    res.sendFile(path.join(__dirname, 'html', 'teammember.html'));
});

router.get('/ProductDetail', (req, res) => {
    console.log("Request at " + req.url);
    res.sendFile(path.join(__dirname, 'html', 'ProductDetail.html'));
});

router.get('/AllPro', (req, res) => {
    console.log("Request at " + req.url);
    res.sendFile(path.join(__dirname, 'html', 'AllPro.html'));
});

router.get('/SearchPage', (req, res) => {
    console.log("Request at " + req.url);
    res.sendFile(path.join(__dirname, 'html', 'SearchPage.html'));
});

router.get('/HomePage', (req, res) => {
    console.log("Request at " + req.url);
    res.sendFile(path.join(__dirname, 'html', 'HomePage.html'));
});

// Apply Router
app.use(router);

// Basic Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err.stack);
    res.status(500).json({ error: 'Something went wrong on the server!' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log("__dirname is:", __dirname);
});