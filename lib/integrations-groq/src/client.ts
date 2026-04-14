import Groq from "groq-sdk";

let groqInstance: Groq | null = null;

if (process.env.GROQ_API_KEY) {
  try {
    groqInstance = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  } catch (e) {
    console.warn("Failed to initialize Groq client:", e);
  }
} else {
  console.warn("GROQ_API_KEY not set. Groq features will be unavailable.");
}

export const groq = groqInstance as Groq;
