const prisma = require('../config/db');

async function listProducts({ page = 1, limit = 10, search }) {
  const skip = (page - 1) * limit;

  const where = {
    isActive: true,
  };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items,
    meta: {
      page,
      limit,
      total,
    },
  };
}

async function getProductById(id) {
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
  });

  if (!product || !product.isActive) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }

  return product;
}

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

async function createProduct(data) {
  const slug = slugify(data.name);

  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug,
      description: data.description || null,
      price: data.price,
      stock: data.stock,
      imageUrl: data.imageUrl || null,
    },
  });

  return product;
}

async function updateProduct(id, data) {
  const product = await prisma.product.update({
    where: { id: Number(id) },
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      imageUrl: data.imageUrl,
      isActive: data.isActive,
    },
  });

  return product;
}

async function deleteProduct(id) {
  await prisma.product.update({
    where: { id: Number(id) },
    data: {
      isActive: false,
    },
  });

  return true;
}

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
