import { Router } from 'express';
import { onboardVisitor, getVisitorHistory, handleChat } from '../controllers/widgetController.js';

const router = Router();

router.post('/onboard', onboardVisitor);
router.get('/history/:visitorId', getVisitorHistory);
router.post('/chat', handleChat);

export default router;