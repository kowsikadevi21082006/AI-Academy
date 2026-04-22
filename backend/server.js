const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();


const webhookRoutes = require('./routes/webhook');
const app = express();
const PORT = process.env.PORT || 3000;

// Production-ready Middleware
app.use(cors());
app.use(bodyParser.json());

// Main Dynamic Routing
app.use('/', webhookRoutes);

// Global Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: "online", module: "AI-Academy-Chatbot" });
});

// Port Binding with Error Handling
const server = app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`🚀 AI Academy Backend is LIVE`);
    console.log(`🔗 Webhook Path: http://localhost:${PORT}/webhook`);
    console.log(`========================================`);
});

server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
        console.error(`❌ Error: Port ${PORT} is already in use.`);
        console.error(`💡 Solution: Run 'npm run dev' to automatically kill the old process and restart.`);
        process.exit(1);
    }
});
