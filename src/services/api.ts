//  send message to ChartBarStackedIcon
import axios from "axios";
import {getAuth } from "firebase/auth";

const API_BASE_URL = "http://localhost:8000/chat"
// const API_URL = "https://api.openai.com/v1/chat/completions";

export const sendMessageToBackend = async (userMsg: string): Promise<string> => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        throw new Error("User not authenticated");
    }
    const userId = user.uid;

    const idToken = await user.getIdToken();

    try {
        const res = await axios.post(
            API_BASE_URL,
            {
                user_id: user.uid,
                messgae: userMsg,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
                },
            }
        );
        return res.data.response; // assuming FastAPI resturns: { response: "..." }
    } catch (error: any) {
        console.error("backend error:", error);
        return "Error from AI: " + (error.response?.data?.detail || error.message);
    }
};