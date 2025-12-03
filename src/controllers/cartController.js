const { success } = require('../utils/apiResponse');
const cartService = require('../services/cartService');

async function getCart(req, res, next) {
  try {
    const data = await cartService.getCartByUser(req.user.id);
    return success(res, data, 'Cart fetched');
  } catch (err) {
    next(err);
  }
}

async function addItem(req, res, next) {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity == null) {
      const err = new Error('productId and quantity are required');
      err.statusCode = 400;
      throw err;
    }

    const item = await cartService.addItemToCart(req.user.id, {
      productId,
      quantity,
    });

    return success(res, item, 'Item added to cart', 201);
  } catch (err) {
    next(err);
  }
}

async function updateItem(req, res, next) {
  try {
    const { quantity } = req.body;

    const item = await cartService.updateCartItem(
      req.user.id,
      Number(req.params.itemId),
      quantity
    );

    return success(res, item, 'Cart item updated');
  } catch (err) {
    next(err);
  }
}

async function removeItem(req, res, next) {
  try {
    await cartService.removeCartItem(req.user.id, Number(req.params.itemId));
    return success(res, null, 'Cart item removed');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCart,
  addItem,
  updateItem,
  removeItem,
};
