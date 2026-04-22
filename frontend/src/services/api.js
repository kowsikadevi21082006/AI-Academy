import axios from 'axios';

const API_BASE_URL = `http://${window.location.hostname}:3000`;

export const askQuestion = async (question) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/ask`, { question });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
