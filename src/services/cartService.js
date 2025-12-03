const prisma = require('../config/db');

async function getOrCreateCart(userId) {
  let cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId,
      },
    });
  }

  return cart;
}

async function getCartByUser(userId) {
  const cart = await getOrCreateCart(userId);

  const items = await prisma.cartItem.findMany({
    where: { cartId: cart.id },
    include: {
      product: true,
    },
  });

  const mapped = items.map((item) => ({
    id: item.id,
    productId: item.productId,
    productName: item.product.name,
    price: item.product.price,
    quantity: item.quantity,
    subtotal: item.product.price * item.quantity,
  }));

  const total = mapped.reduce((sum, i) => sum + i.subtotal, 0);

  return {
    items: mapped,
    total,
  };
}

async function addItemToCart(userId, { productId, quantity }) {
  const cart = await getOrCreateCart(userId);

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product || !product.isActive) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }

  if (quantity <= 0) {
    const err = new Error('Quantity must be greater than 0');
    err.statusCode = 400;
    throw err;
  }

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  });

  if (existingItem) {
    const updated = await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: existingItem.quantity + quantity,
      },
    });
    return updated;
  }

  const item = await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      quantity,
    },
  });

  return item;
}

async function updateCartItem(userId, itemId, quantity) {
  if (quantity <= 0) {
    const err = new Error('Quantity must be greater than 0');
    err.statusCode = 400;
    throw err;
  }

  const cart = await getOrCreateCart(userId);

  const item = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cartId: cart.id,
    },
  });

  if (!item) {
    const err = new Error('Cart item not found');
    err.statusCode = 404;
    throw err;
  }

  const updated = await prisma.cartItem.update({
    where: { id: item.id },
    data: {
      quantity,
    },
  });

  return updated;
}

async function removeCartItem(userId, itemId) {
  const cart = await getOrCreateCart(userId);

  const item = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cartId: cart.id,
    },
  });

  if (!item) {
    const err = new Error('Cart item not found');
    err.statusCode = 404;
    throw err;
  }

  await prisma.cartItem.delete({
    where: { id: item.id },
  });

  return true;
}

async function clearCart(cartId) {
  await prisma.cartItem.deleteMany({
    where: { cartId },
  });
}

module.exports = {
  getCartByUser,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  getOrCreateCart,
  clearCart,
};
