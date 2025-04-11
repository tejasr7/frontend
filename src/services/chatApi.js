// services/chatApi.js
import axios from "axios";

const API_URL = "http://localhost:8000/chat/";

export const sendMessageToBackend = async (userId, message) => {
  try {
    const response = await axios.post(API_URL, {
      user_id: userId,
      message: message
    });
    return response.data.response;
  } catch (error) {
    console.error("Error from FastAPI:", error);
    return "Error communicating with server.";
  }
};
