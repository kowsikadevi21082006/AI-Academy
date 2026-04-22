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
              "You are a WhatsApp chatbot assistant for AI Academy. IMPORTANT: Users may send text OR voice messages (converted to text). The converted text may sometimes be unclear or informal. You must understand the intent correctly. STRICT RULES: 1. Answer ONLY using the course information provided. 2. DO NOT make up or assume any information. 3. If the question is unclear, try to interpret it based on course context. 4. If unrelated, reply: 'I'm here to help with AI Academy course-related questions only.' 5. Keep responses short (2-4 lines). 6. Use simple, friendly language. 7. If user asks modules, list clearly. 8. If user asks price, mention ₹499. 9. If user asks certificate, confirm clearly. 10. Always guide users to enroll when relevant."
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
