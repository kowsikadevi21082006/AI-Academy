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
app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`🚀 AI Academy Backend is LIVE`);
    console.log(`🔗 Webhook Path: http://localhost:${PORT}/webhook`);
    console.log(`========================================`);
});
