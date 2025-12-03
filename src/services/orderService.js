const prisma = require('../config/db');
const cartService = require('./cartService');

async function createOrderFromCart(userId) {
  const cart = await cartService.getOrCreateCart(userId);

  const cartItems = await prisma.cartItem.findMany({
    where: { cartId: cart.id },
    include: { product: true },
  });

  if (cartItems.length === 0) {
    const err = new Error('Cart is empty');
    err.statusCode = 400;
    throw err;
  }

  let totalAmount = 0;
  const orderItemsData = [];

  for (const item of cartItems) {
    if (!item.product.isActive) {
      const err = new Error(`Product ${item.product.name} is not available`);
      err.statusCode = 400;
      throw err;
    }

    const subtotal = item.product.price * item.quantity;
    totalAmount += subtotal;

    orderItemsData.push({
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price,
    });
  }

  const [order] = await prisma.$transaction([
    prisma.order.create({
      data: {
        userId,
        totalAmount,
        status: 'PENDING',
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    }),
    prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    }),
  ]);

  return order;
}

async function getOrdersByUser(userId) {
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  return orders;
}

async function getOrderByIdForUser(userId, orderId) {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!order) {
    const err = new Error('Order not found');
    err.statusCode = 404;
    throw err;
  }

  return order;
}

async function getAllOrders(status) {
  const where = {};
  if (status) {
    where.status = status;
  }

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      items: {
        include: { product: true },
      },
    },
  });

  return orders;
}

async function updateOrderStatus(orderId, status) {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  return order;
}

module.exports = {
  createOrderFromCart,
  getOrdersByUser,
  getOrderByIdForUser,
  getAllOrders,
  updateOrderStatus,
};
