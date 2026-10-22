import { Router } from 'express';
import widgetRoutes from './widgetRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = Router();

router.use('/widget', widgetRoutes);
router.use('/', adminRoutes);

export default router;