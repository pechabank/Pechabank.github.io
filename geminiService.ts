import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize only if key exists to prevent immediate crashes, handle errors gracefully in components
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const generateFinancialAdvice = async (
  query: string, 
  contextData: string
): Promise<string> => {
  if (!ai) {
    return "API Key configuration required to access PechaAI.";
  }

  try {
    const model = ai.models;
    const response = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Context: ${contextData}\n\nUser Query: ${query}`,
      config: {
        systemInstruction: "You are PechaAI, a cool, minimalist financial assistant for PechaBank. Your tone is professional but relaxed, slightly edgy. Keep answers concise, helpful, and formatted for easy reading. Do not use markdown bolding excessively.",
      }
    });
    
    return response.text || "I couldn't generate a response right now.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Connection disrupted. Please try again later.";
  }
};