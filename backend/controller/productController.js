import Product from '../models/productModel.js';
import HandleError from '../utils/handleError.js';
import handleAsyncError from '../middleware/handleAsyncError.js';
import APIFunctionality from '../utils/apiFunctionality.js';

// http://localhost:5051/api/v1/products/6884fb94337b3bce491bbac3?keyword=shirt

// Creating Products
export const createProducts = handleAsyncError(async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product
  });
});

// Get All Products
export const getAllProducts = handleAsyncError(async (req, res, next) => {
  const resultPerPage = 3;
  const apiFeatures = new APIFunctionality(Product.find(), req.query).search().filter();

  // Getting filtered query before pagination
  const filteredQuery = apiFeatures.query.clone();
  const productCount = await filteredQuery.countDocuments();
  // Calculate totalpages based on filtered count
  const totalPages = Math.ceil(productCount / resultPerPage);
  const page = Number(req.query.page) || 1;

  if ( page > totalPages && productCount > 0) {
    return next(new HandleError('This page does not exist', 404));
  }
  // Apply pagination
  apiFeatures.pagination(resultPerPage);
  const products = await apiFeatures.query;

  if (!products || products.length === 0) {
    return next(new HandleError('No products found', 404));
  }
  res.status(200).json({
    success: true,
    products,
    productCount,
    resultPerPage,
    totalPages,
    currentPage: page
  });
});

// Update Product
export const updateProduct = handleAsyncError(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!product) {
    return next(new HandleError('Product not found', 404));
  }
  res.status(200).json({
    success: true,
    product
  });
});

// Delete Product
export const deleteProduct = handleAsyncError(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return next(new HandleError('Product not found', 404));
  }
  res.status(200).json({
    success: true,
    message: 'Product deleted successfully'
  });
});


// Accessing Single Product
export const getSingleProduct = handleAsyncError(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new HandleError('Product not found', 404));
  }
  res.status(200).json({
    success: true,
    product
  });
});