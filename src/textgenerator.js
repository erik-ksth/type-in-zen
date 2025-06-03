// node --version # Should be >= 18
// npm install @google/generative-ai

import { GoogleGenAI } from "@google/genai";

const MODEL_NAME = "gemma-3-27b-it";
const API_KEY = process.env.REACT_APP_GENAI_API_KEY;

async function runChat() {
  const ai = new GoogleGenAI({
    apiKey: API_KEY,
  });

  const config = {
    responseMimeType: "text/plain",
  };

  const prompt =
    "Write a new 100-word relaxing story for a child. Make it soothing and peaceful.";

  const contents = [
    {
      role: "user",
      parts: [
        {
          text: prompt,
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model: MODEL_NAME,
    config,
    contents,
  });

  let fullResponse = "";
  for await (const chunk of response) {
    fullResponse += chunk.text;
  }

  console.log("Generated story:", fullResponse);
  return fullResponse;
}

export default runChat;
