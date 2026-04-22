const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

/**
 * SPEECH-TO-TEXT SERVICE (Whisper)
 */
async function transcribeAudio(audioUrl) {
  try {
    // 1. Download
    const audioRes = await axios.get(audioUrl, {
      responseType: 'arraybuffer',
      headers: { 'Authorization': `Bearer ${process.env.WHAPI_TOKEN}` }
    });

    // 2. Transcribe
    const formData = new FormData();
    formData.append('file', Buffer.from(audioRes.data), {
      filename: 'audio.ogg',
      contentType: 'audio/ogg',
    });
    formData.append('model', 'whisper-1');

    const response = await axios.post(
      'https://api.openai.com/v1/audio/transcriptions',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        }
      }
    );

    return response.data.text;
  } catch (error) {
    console.error("[SPEECH ERROR]:", error.response?.data || error.message);
    throw new Error("Transcription failed");
  }
}

module.exports = { transcribeAudio };
