require('dotenv').config();
const { ChromaClient } = require('chromadb');
const { OpenAI } = require('openai');
const courseData = require('../data/courseData');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const client = new ChromaClient();

async function setupRAG() {
  try {
    console.log("Initializing ChromaDB...");
    
    // Create or get collection
    const collection = await client.getOrCreateCollection({
      name: "ai_academy_course",
    });

    console.log("Generating embeddings and adding to ChromaDB...");

    for (let i = 0; i < courseData.length; i++) {
        const text = courseData[i];
        
        // Generate embedding using OpenAI
        const embeddingResponse = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: text,
        });
        const embedding = embeddingResponse.data[0].embedding;

        // Add to collection
        await collection.add({
            ids: [`chunk-${i}`],
            embeddings: [embedding],
            metadatas: [{ source: "course_data" }],
            documents: [text],
        });
    }

    console.log("RAG Setup Complete! Data indexed in ChromaDB.");
  } catch (error) {
    console.error("Error setting up RAG:", error);
  }
}

if (require.main === module) {
  setupRAG();
}

module.exports = setupRAG;
