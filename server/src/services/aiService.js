import groq from '../config/groq.js';
import env from '../config/env.js';
import { SYSTEM_PROMPT } from '../config/prompt.js';

const buildSystemInstructions = (visitor) => {
  const visitorContext = `
[VISITOR PROFILE FOR PERSONALIZATION]:
- Visitor Name: ${visitor.name}
- Profession: ${visitor.profession}
- Primary Goal: ${visitor.goal}

Please customize all your responses to fit this profile context. Direct your advice, examples, and greetings appropriately based on these values. Do not break character.
`;
  return `${SYSTEM_PROMPT}\n${visitorContext}`;
};

/**
 * Generates an AI reply for a visitor given their chat history.
 * Never throws: falls back to friendly messages on failure.
 */
export const generateReply = async ({ visitor, history, userText }) => {
  if (!env.GROQ_API_KEY) {
    console.log('[AI] [DEMO MODE] No GROQ_API_KEY. Using mock placeholder.');
    return `[Demo Mode] Hi ${visitor.name}! I received your message: "${userText}". Please configure GROQ_API_KEY in the backend .env to enable true AI responses.`;
  }

  const messages = [
    { role: 'system', content: buildSystemInstructions(visitor) },
    ...history.map((msg) => ({
      role: msg.sender === 'visitor' ? 'user' : 'assistant',
      content: msg.text,
    })),
  ];

  try {
    console.log(`[AI] Dispatching prompt to Groq model: "${env.GROQ_MODEL}"...`);
    const completion = await groq.chat.completions.create({
      messages,
      model: env.GROQ_MODEL,
      temperature: 0.7,
      max_tokens: 1024,
    });
    return completion.choices[0].message.content;
  } catch (err) {
    console.error('[AI] [ERROR] Groq API call failed:', err);
    return 'I encountered an API configuration error. Please ensure the Groq API key is valid.';
  }
};