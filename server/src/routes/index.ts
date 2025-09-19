
import { Router } from 'express';
import userRoutes from './userRoutes';
import authRoutes from './authRoutes';
import roomRoutes from './roomRoutes';
import reservationRoutes from './reservationRoutes';

const router = Router();

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/rooms', roomRoutes);
router.use('/reservations', reservationRoutes);


export default router;