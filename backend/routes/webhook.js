const express = require('express');
const router = express.Router();
const { getContext } = require('../services/ragQuery');
const { generateResponse } = require('../services/llm');
const { sendWhatsAppMessage } = require('../services/whapi');
const { transcribeAudio } = require('../services/speechToText');
const { isRateLimited } = require('../utils/rateLimiter');

/**
 * FINAL WHATSAPP WEBHOOK FLOW
 * Handles Text and Audio messages through the RAG pipeline.
 */
router.post('/webhook', async (req, res) => {
  try {
    const messages = req.body.messages;
    if (!messages || messages.length === 0) return res.sendStatus(200);

    const message = messages[0];
    if (message.from_me) return res.sendStatus(200);

    const from = message.from;
    let userQuery = "";

    // 1. INPUT DETECTION (Text/Audio)
    if (message.type === "text") {
      userQuery = message.text.body;
    }
    else if (message.type === "audio") {
      try {
        userQuery = await transcribeAudio(message.audio.link);
      } catch (err) {
        await sendWhatsAppMessage(from, "Sorry, I couldn't understand your voice message.");
        return res.sendStatus(200);
      }
    }

    // 2. ENTRY RULE CHECK
    if (userQuery.trim().toLowerCase() === "ai-academy") {
      const entryReply = "Thank you for reaching out to the AI Academy! How can I help you today?";
      if (req.path === '/webhook') {
        await sendWhatsAppMessage(from, entryReply);
        return res.sendStatus(200);
      } else {
        return res.json({ response: entryReply });
      }
    }

    // 3. SPAM PROTECTION
    if (isRateLimited(from)) return res.sendStatus(200);

    // 3. RAG PIPELINE (Retrieve Knowledge)
    const context = await getContext(userQuery);

    // 4. LLM GENERATION (Cerebras)
    const reply = await generateResponse(context, userQuery);

    // 5. SEND WHATSAPP MESSAGE
    await sendWhatsAppMessage(from, reply);

    res.sendStatus(200);
  } catch (error) {
    console.error("[WEBHOOK ERROR]:", error.message);
    res.sendStatus(500);
  }
});

// Dashboard Support
router.post('/ask', async (req, res) => {
  try {
    const { question } = req.body;
    const context = await getContext(question);
    const response = await generateResponse(context, question);
    res.json({ response });
  } catch (err) {
    console.error("[DASHBOARD ERROR]:", err.message);
    res.status(500).json({ error: "Failed", details: err.message });
  }
});

module.exports = router;

