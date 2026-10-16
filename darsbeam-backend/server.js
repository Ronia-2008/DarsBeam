const app = require('./src/app');
const mongoose = require('mongoose');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// اتصال به MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ اتصال به MongoDB برقرار شد!');
        app.listen(PORT, () => {
            console.log(`🚀 سرور روی پورت ${PORT} روشن شد!`);
            console.log(`📡 آدرس: http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ خطا در اتصال به MongoDB:', err);
        process.exit(1);
    });