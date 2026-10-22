import mongoose from 'mongoose';
import Visitor from '../models/Visitor.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import { generateReply } from '../services/aiService.js';

/**
 * POST /api/widget/onboard
 * Onboard a first-time visitor and create their first conversation.
 */
export const onboardVisitor = async (req, res) => {
  const { name, profession, goal } = req.body;
  console.log(`[WIDGET] [ONBOARD] Visitor: "${name}" (${profession}) | Goal: "${goal}"`);

  try {
    if (!name || !profession || !goal) {
      return res.status(400).json({ error: 'Name, profession, and goal are all required.' });
    }

    const savedVisitor = await new Visitor({ name, profession, goal }).save();
    const savedConversation = await new Conversation({ visitorId: savedVisitor._id }).save();

    console.log(`[WIDGET] [ONBOARD] [SUCCESS] Conversation ID: ${savedConversation._id}`);

    return res.status(201).json({
      message: 'Onboarding completed successfully.',
      visitorId: savedVisitor._id,
      conversationId: savedConversation._id,
      visitorName: savedVisitor.name,
    });
  } catch (error) {
    console.error('[WIDGET] [ONBOARD] [ERROR]', error);
    return res.status(500).json({ error: 'Failed to complete visitor onboarding.' });
  }
};

/**
 * GET /api/widget/history/:visitorId
 * Fetch latest conversation + messages for a returning visitor.
 */
export const getVisitorHistory = async (req, res) => {
  const { visitorId } = req.params;
  console.log(`[WIDGET] [HISTORY] Visitor ID: ${visitorId}`);

  try {
    if (!mongoose.Types.ObjectId.isValid(visitorId)) {
      return res.status(400).json({ error: 'Invalid visitor ID.' });
    }

    const visitor = await Visitor.findById(visitorId);
    if (!visitor) {
      return res.status(404).json({ error: 'Visitor not found.' });
    }

    const conversation = await Conversation.findOne({ visitorId }).sort({ createdAt: -1 });
    if (!conversation) {
      return res.status(200).json({ visitorName: visitor.name, conversationId: null, messages: [] });
    }

    const messages = await Message.find({ conversationId: conversation._id }).sort({ createdAt: 1 });
    console.log(`[WIDGET] [HISTORY] [SUCCESS] ${messages.length} messages for "${visitor.name}".`);

    return res.status(200).json({
      visitorName: visitor.name,
      conversationId: conversation._id,
      messages: messages.map(({ sender, text, createdAt }) => ({ sender, text, createdAt })),
    });
  } catch (error) {
    console.error('[WIDGET] [HISTORY] [ERROR]', error);
    return res.status(500).json({ error: 'Failed to retrieve conversation history.' });
  }
};

/**
 * POST /api/widget/chat
 * Save the visitor message, get an AI reply with personalised context, save and return it.
 */
export const handleChat = async (req, res) => {
  const { visitorId, conversationId, text } = req.body;
  console.log(`[WIDGET] [CHAT] Message from visitor ${visitorId}: "${text}"`);

  try {
    if (!visitorId || !conversationId || !text) {
      return res.status(400).json({ error: 'visitorId, conversationId, and text are required.' });
    }

    if (!mongoose.Types.ObjectId.isValid(visitorId) || !mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ error: 'Invalid visitor or conversation ID.' });
    }

    const visitor = await Visitor.findById(visitorId);
    if (!visitor) {
      return res.status(404).json({ error: 'Visitor profile not found.' });
    }

    await new Message({ conversationId, sender: 'visitor', text }).save();

    // Last 20 messages only, for prompt token safety
    const history = await Message.find({ conversationId }).sort({ createdAt: 1 }).limit(20);

    const reply = await generateReply({ visitor, history, userText: text });

    await new Message({ conversationId, sender: 'ai', text: reply }).save();
    console.log('[WIDGET] [CHAT] [SUCCESS] AI response saved.');

    return res.status(200).json({ reply });
  } catch (error) {
    console.error('[WIDGET] [CHAT] [ERROR]', error);
    return res.status(500).json({ error: 'Failed to process chat message.' });
  }
};