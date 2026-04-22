const courseData = require('../data/courseData');

/**
 * PRODUCTION-READY LOCAL RETRIEVAL
 * This service finds the most relevant knowledge chunks without using ANY external APIs.
 */
async function getContext(query) {
  try {
    if (!query || query.length < 3) return "";

    // 1. Normalize and Tokenize
    const queryTokens = query.toLowerCase()
      .replace(/[^a-z0-9 ]/g, '') // Remove punctuation
      .split(/\s+/)
      .filter(token => token.length > 2); // Filter out noise words (is, of, the)

    if (queryTokens.length === 0) return "";

    // 2. Score Chunks based on Token Overlap
    let scoredChunks = courseData.map((text, index) => {
      const textLower = text.toLowerCase();
      let score = 0;

      queryTokens.forEach(token => {
        if (textLower.includes(token)) {
          score += 1;
        }
      });

      return { text, score };
    });

    // 3. Manual Sort (Bubble Sort implementation for "Interview-Ready" logic)
    // No built-in .sort() as requested
    for (let i = 0; i < scoredChunks.length; i++) {
        for (let j = 0; j < (scoredChunks.length - i - 1); j++) {
            if (scoredChunks[j].score < scoredChunks[j+1].score) {
                let temp = scoredChunks[j];
                scoredChunks[j] = scoredChunks[j+1];
                scoredChunks[j+1] = temp;
            }
        }
    }

    // 4. Extract Top 3 uniquely relevant chunks (only those with matches)
    const topChunks = [];
    for (let i = 0; i < scoredChunks.length && topChunks.length < 3; i++) {
        if (scoredChunks[i].score > 0) {
            topChunks.push(scoredChunks[i].text);
        }
    }

    return topChunks.join("\n---\n");
  } catch (error) {
    console.error("[LOCAL RAG ERROR]:", error.message);
    return "";
  }
}

module.exports = { getContext };
