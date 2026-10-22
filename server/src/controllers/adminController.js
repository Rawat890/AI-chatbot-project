import mongoose from 'mongoose';
import Visitor from '../models/Visitor.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

/** GET /api/analytics */
export const getAnalytics = async (req, res) => {
  try {
    const [totalVisitors, totalConversations, totalMessages, professionBreakdown] = await Promise.all([
      Visitor.countDocuments(),
      Conversation.countDocuments(),
      Message.countDocuments(),
      Visitor.aggregate([
        { $group: { _id: '$profession', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
    ]);

    return res.status(200).json({ totalVisitors, totalConversations, totalMessages, professionBreakdown });
  } catch (error) {
    console.error('[ADMIN] [ANALYTICS] [ERROR]', error);
    return res.status(500).json({ error: 'Failed to fetch dashboard metrics.' });
  }
};

/** GET /api/conversations */
export const listConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find().populate('visitorId').sort({ createdAt: -1 });
    return res.status(200).json(conversations);
  } catch (error) {
    console.error('[ADMIN] [CONVERSATIONS] [ERROR]', error);
    return res.status(500).json({ error: 'Failed to fetch conversations.' });
  }
};

/** GET /api/conversations/:id */
export const getConversationById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid conversation ID.' });
    }

    const conversation = await Conversation.findById(id).populate('visitorId');
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found.' });
    }

    const messages = await Message.find({ conversationId: id }).sort({ createdAt: 1 });
    return res.status(200).json({ conversation, messages });
  } catch (error) {
    console.error('[ADMIN] [CONVERSATIONS] [ERROR]', error);
    return res.status(500).json({ error: 'Failed to retrieve conversation logs.' });
  }
};