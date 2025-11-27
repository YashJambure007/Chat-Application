import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/ask", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent",
      {
        contents: [
          {
            parts: [
              { text: message }
            ]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          key: process.env.GEMINI_API_KEY
        }
      }
    );

    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that.";
    res.json({ reply });
  } catch (error) {
    console.error("AI Error:", error?.response?.data || error.message);
    res.status(500).json({
      error: "Failed to fetch AI response.",
      details: error?.response?.data || error.message
    });
  }
});

export default router;
