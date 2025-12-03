const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const cartController = require('../controllers/cartController');

const router = express.Router();

router.use(authMiddleware);

router.get('/', cartController.getCart);
router.post('/items', cartController.addItem);
router.put('/items/:itemId', cartController.updateItem);
router.delete('/items/:itemId', cartController.removeItem);

module.exports = router;
