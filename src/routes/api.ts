import { Router } from 'express';
import inventoryRoutes from './inventory';
import authRoutes from './auth';

const router = Router();

// Auth routes (no authentication required)
router.use('/auth', authRoutes);

// Inventory routes (protected)
router.use('/inventory', inventoryRoutes);

export default router;

