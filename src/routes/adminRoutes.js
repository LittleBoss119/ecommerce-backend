const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/rbacMiddleware');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.use(authMiddleware);
router.use(requireRole(['ADMIN']));

// admin order management
router.get('/orders', orderController.adminGetOrders);
router.put('/orders/:id/status', orderController.adminUpdateOrderStatus);

module.exports = router;
