import dotenv from "dotenv";
dotenv.config();

const env = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nextChat_bot',
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',
  GROQ_MODEL: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || '',
};

if (!env.GROQ_API_KEY) {
  console.warn('WARNING: GROQ_API_KEY is not defined in the environment. Chatbot will run in demo mode.');
}

export default env;