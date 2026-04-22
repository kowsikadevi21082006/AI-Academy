require('dotenv').config();
const axios = require('axios');

async function sendWhatsAppMessage(to, text) {
  try {
    const response = await axios.post(
      'https://gate.whapi.cloud/messages/text',
      {
        to: to,
        body: text
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.WHAPI_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log(`Message sent to ${to}: ${response.data.message?.id || 'Success'}`);
    return response.data;
  } catch (error) {
    console.error("Error sending Whapi message:", error.response?.data || error.message);
    // Don't throw, just log so the server doesn't crash on one failed message
  }
}

module.exports = { sendWhatsAppMessage };
