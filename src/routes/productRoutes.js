const express = require('express');
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/rbacMiddleware');

const router = express.Router();

// Public
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);

// Admin only
router.post(
  '/',
  authMiddleware,
  requireRole(['ADMIN']),
  productController.createProduct
);

router.put(
  '/:id',
  authMiddleware,
  requireRole(['ADMIN']),
  productController.updateProduct
);

router.delete(
  '/:id',
  authMiddleware,
  requireRole(['ADMIN']),
  productController.deleteProduct
);

module.exports = router;
