const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.use(authMiddleware);

// user
router.post('/', orderController.createOrder);
router.get('/', orderController.getMyOrders);
router.get('/:id', orderController.getMyOrderDetail);

module.exports = router;
