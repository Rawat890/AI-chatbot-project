import { Router } from 'express';
import { getAnalytics, listConversations, getConversationById } from '../controllers/adminController.js';

const router = Router();

router.get('/analytics', getAnalytics);
router.get('/conversations', listConversations);
router.get('/conversations/:id', getConversationById);

export default router;