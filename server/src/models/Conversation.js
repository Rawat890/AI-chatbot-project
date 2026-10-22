import mongoose from "mongoose";
// Schema for tracking a conversation session associated with a visitor
const ConversationSchema = new mongoose.Schema({
  visitorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Visitor',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Conversation = mongoose.model('Conversation', ConversationSchema);

export default Conversation