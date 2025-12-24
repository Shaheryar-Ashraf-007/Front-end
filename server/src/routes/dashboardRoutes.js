import express from 'express';
import { getDashboardMetrics } from '../controllers/dashboardController.js';
import { middleware } from '../middleware/middleware.js';

const router = express.Router();

router.get('/', middleware,getDashboardMetrics);

export default router;