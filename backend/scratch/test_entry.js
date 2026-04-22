const axios = require('axios');

async function testEntryRule() {
  try {
    const response = await axios.post('http://localhost:3000/ask', {
      question: "AI-Academy"
    });
    console.log("Response:", JSON.stringify(response.data, null, 2));
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
  }
}

testEntryRule();
