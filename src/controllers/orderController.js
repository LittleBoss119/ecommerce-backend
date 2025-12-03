const { success } = require('../utils/apiResponse');
const orderService = require('../services/orderService');

async function createOrder(req, res, next) {
  try {
    const order = await orderService.createOrderFromCart(req.user.id);
    return success(res, order, 'Order created', 201);
  } catch (err) {
    next(err);
  }
}

async function getMyOrders(req, res, next) {
  try {
    const orders = await orderService.getOrdersByUser(req.user.id);
    return success(res, orders, 'Orders fetched');
  } catch (err) {
    next(err);
  }
}

async function getMyOrderDetail(req, res, next) {
  try {
    const orderId = Number(req.params.id);
    const order = await orderService.getOrderByIdForUser(req.user.id, orderId);
    return success(res, order, 'Order detail');
  } catch (err) {
    next(err);
  }
}

async function adminGetOrders(req, res, next) {
  try {
    const status = req.query.status;
    const orders = await orderService.getAllOrders(status);
    return success(res, orders, 'All orders fetched');
  } catch (err) {
    next(err);
  }
}

async function adminUpdateOrderStatus(req, res, next) {
  try {
    const orderId = Number(req.params.id);
    const { status } = req.body;

    if (!status) {
      const err = new Error('Status is required');
      err.statusCode = 400;
      throw err;
    }

    const order = await orderService.updateOrderStatus(orderId, status);
    return success(res, order, 'Order status updated');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getMyOrderDetail,
  adminGetOrders,
  adminUpdateOrderStatus,
};
