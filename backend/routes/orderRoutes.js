import express from 'express';
import {
  addOrderItems,
  getMyOrders,
  getOrderByID,
  updateOrderToPay,
  updateOrderToDelivered,
  getOrders,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, addOrderItems);
router.route('/').get(protect, getOrders);
router.route('/mine').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderByID);
router.route('/:id/pay').put(protect, updateOrderToPay);
router.route('/:id/deliver').put(protect, updateOrderToDelivered);

export default router;
