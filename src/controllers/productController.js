const { success } = require('../utils/apiResponse');
const productService = require('../services/productService');

async function getProducts(req, res, next) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search;

    const result = await productService.listProducts({ page, limit, search });

    return success(res, result, 'Products fetched');
  } catch (err) {
    next(err);
  }
}

async function getProduct(req, res, next) {
  try {
    const product = await productService.getProductById(req.params.id);
    return success(res, product, 'Product detail');
  } catch (err) {
    next(err);
  }
}

async function createProduct(req, res, next) {
  try {
    const { name, description, price, stock, imageUrl } = req.body;

    if (!name || !price || stock == null) {
      const err = new Error('Name, price and stock are required');
      err.statusCode = 400;
      throw err;
    }

    const product = await productService.createProduct({
      name,
      description,
      price,
      stock,
      imageUrl,
    });

    return success(res, product, 'Product created', 201);
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    const { name, description, price, stock, imageUrl, isActive } = req.body;

    const product = await productService.updateProduct(req.params.id, {
      name,
      description,
      price,
      stock,
      imageUrl,
      isActive,
    });

    return success(res, product, 'Product updated');
  } catch (err) {
    next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    await productService.deleteProduct(req.params.id);
    return success(res, null, 'Product deactivated');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
