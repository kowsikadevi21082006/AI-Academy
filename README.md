# AI Academy WhatsApp Chatbot

A production-ready, RAG-based WhatsApp chatbot designed to provide accurate course information.

## 🏗️ Architecture Flow
1. **User** sends a message on WhatsApp.
2. **Whapi** receives it and forwards it to our **Express Webhook**.
3. **Local RAG** (Keyword Search) analyzes the message and retrieves facts from `courseData.js`.
4. **Cerebras LLM** receives the facts + question and generates a natural response.
5. **Whapi API** sends the response back to the user's WhatsApp.

## 🧠 RAG (Retrieval-Augmented Generation) Concept
Traditional AI "guesses" answers. RAG makes AI "look up" information first.
* **Retrieval:** We search our internal `courseData` file for keywords matching the user's query.
* **Augmentation:** We provide these found facts to the LLM.
* **Generation:** the LLM answers the question using **only** those facts.

## 🚀 How to Run
1. **Dependencies:** `npm install` in the backend folder.
2. **Configuration:** Add `WHAPI_TOKEN` and `CEREBRAS_API_KEY` to `.env`.
3. **Public URL:** Start ngrok: `ngrok http 3000`.
4. **Webhook:** Set your Whapi webhook URL to `https://<ngrok-id>.ngrok-free.app/webhook`.
5. **Start:** Run `npm start`.


