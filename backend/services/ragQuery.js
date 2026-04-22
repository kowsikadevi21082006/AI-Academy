const courseData = require('../data/courseData');

/**
 * SMART LOCAL RETRIEVAL
 * Improved with synonym handling and fallback context to ensure the AI always has data.
 */
async function getContext(query) {
  try {
    if (!query) return "";

    const queryLower = query.toLowerCase();
    
    // 1. Synonym mapping to bridge the gap between user questions and course data
    const synonyms = {
      "price": ["cost", "payment", "fees", "free", "pay", "charge", "amount"],
      "module": ["unit", "chapter", "lesson", "syllabus", "content"],
      "certificate": ["complete", "finish", "earn", "download", "award"],
      "free": ["no cost", "0", "complimentary"]
    };

    // 2. Expand query tokens with synonyms
    let queryTokens = queryLower
      .replace(/[^a-z0-9 ]/g, '')
      .split(/\s+/)
      .filter(t => t.length > 2);

    Object.keys(synonyms).forEach(key => {
      synonyms[key].forEach(syn => {
        if (queryLower.includes(syn) && !queryTokens.includes(key)) {
          queryTokens.push(key);
        }
      });
    });

    // 3. Score Chunks
    let scoredChunks = courseData.map((text) => {
      const textLower = text.toLowerCase();
      let score = 0;
      queryTokens.forEach(token => {
        if (textLower.includes(token)) score += 1;
      });
      return { text, score };
    });

    // 4. Sort and Filter
    const results = scoredChunks
      .sort((a, b) => b.score - a.score)
      .filter(item => item.score > 0)
      .slice(0, 3)
      .map(item => item.text);

    // 5. CRITICAL FALLBACK: If no relevant context is found, return the core syllabus
    // This ensures the AI NEVER says "I don't have that information" for basic questions.
    if (results.length === 0) {
      console.log("[RAG]: No specific matches. Returning core syllabus fallback.");
      return courseData[0] + "\n" + courseData[1]; // First two chunks usually contain modules/pricing
    }

    return results.join("\n---\n");
  } catch (error) {
    console.error("[RAG ERROR]:", error.message);
    return courseData.join("\n"); // Absolute fallback: return everything
  }
}

module.exports = { getContext };
