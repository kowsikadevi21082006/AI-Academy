const axios = require("axios");

/**
 * LLM SERVICE (Cerebras)
 * Generates a response using the Cerebras API based on RAG context.
 */
async function generateResponse(context, userMessage) {
  try {
    const response = await axios.post(
      "https://api.cerebras.ai/v1/chat/completions",
      {
        model: "llama3.1-8b",
        messages: [
          {
            role: "system",
            content:
              "You are a WhatsApp chatbot assistant for AI Academy. IMPORTANT ENTRY RULE: If the user message is exactly 'AI-Academy' (case-insensitive), you MUST respond ONLY with: 'Thank you for reaching out to the AI Academy! How can I help you today?' Do not add anything extra. GENERAL RULES: 1. Answer ONLY using the course information provided. 2. DO NOT make up any information. 3. If unrelated, reply: 'I'm here to help with AI Academy course-related questions only.' 4. Keep responses short (2-4 lines). 5. Use simple and friendly language. 6. Always guide users to enroll when relevant."
          },
          {
            role: "user",
            content: `Context:\n${context}\n\nQuestion:\n${userMessage}`
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CEREBRAS_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 10000
      }
    );

    const reply =
      response.data?.choices?.[0]?.message?.content ||
      "I don't have that information.";

    return reply.trim();

  } catch (err) {
    console.error("LLM ERROR:", err.response?.data || err.message);

    if (err.code === 'ECONNABORTED') return "Sorry, the request timed out. Please try again.";

    return "Sorry, something went wrong. Please try again.";
  }
}

// Exported as an object to match webhook.js logic (DO NOT modify webhook logic)
module.exports = { generateResponse };
