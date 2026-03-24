const express = require('express');
const router = express.Router();
const { createOrder, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', createOrder);
router.get('/', authMiddleware, getAllOrders);
router.put('/:id/status', authMiddleware, updateOrderStatus);

module.exports = router;
