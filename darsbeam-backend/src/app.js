const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ===== Middlewares =====
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== Routes =====
app.get('/api', (req, res) => {
    res.json({ message: '🎯 API درس‌بیم روشن است!' });
});

// ===== Error Handler =====
app.use((err, req, res, next) => {
    console.error('❌ خطا:', err.stack);
    res.status(500).json({ 
        success: false, 
        message: err.message || 'خطای سرور!' 
    });
});

module.exports = app;