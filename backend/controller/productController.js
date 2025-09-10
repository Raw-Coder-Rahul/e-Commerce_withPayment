import Product from '../models/productModel.js';
import HandleError from '../utils/handleError.js';
import handleAsyncError from '../middleware/handleAsyncError.js';
import APIFunctionality from '../utils/apiFunctionality.js';

// http://localhost:5051/api/v1/products/6884fb94337b3bce491bbac3?keyword=shirt

// Creating Products
export const createProducts = handleAsyncError(async (req, res, next) => {
  req.body.user = req.user.id;
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

// Creating and Upadating Review
export const createReviewForProduct = handleAsyncError(async (req, res) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment
  };
  const product = await Product.findById(productId);
  if (!product) {
    return next(new HandleError('Product not found', 404));
  }
  const isReviewed = product.reviews.find(review => review.user.toString() === req.user.id.toString());
  if (isReviewed) {
    product.reviews.forEach(review => {
      if (review.user.toString() === req.user.id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    product.reviews.push(review);

  }
  product.numOfReviews = product.reviews.length;
  let sum = 0;
  product.reviews.forEach(review => {
    sum += review.rating;
  });
  product.ratings = product.reviews.length > 0 ? sum / product.reviews.length : 0;
  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    product
  })
});

// Get All Reviews of a Product
export const getProductReviews = handleAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new HandleError('Product not found', 404));
  }
  res.status(200).json({
    success: true,
    reviews: product.reviews
  });
});

// Deleteing Reviews
export const deleteReview = handleAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new HandleError('Product not found', 404));
  }
  const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());
  let sum = 0;
  reviews.forEach(review => {
    sum += review.rating;
  });
  const ratings = reviews.length > 0 ? sum / reviews.length : 0;
  const numOfReviews = reviews.length;
  await Product.findByIdAndUpdate(req.query.productId, {
    reviews,
    ratings,
    numOfReviews
  }, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    success: true,
    message: 'Review deleted successfully'
  });
});

// Admin - Get All Products
export const getAdminProducts = handleAsyncError(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    products
  });
});