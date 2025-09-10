import Order from '../models/orderModel.js';
import HandleError from '../utils/handleError.js';
import handleAsyncError from '../middleware/handleAsyncError.js';
import Product from '../models/productModel.js';
import mongoose from 'mongoose';
import User from '../models/userModel.js';

// Create New Order
export const createNewOrder = handleAsyncError(async (req, res, next) => {
  const { shippingInfo, orderItems, paymentInfo, paidAt, itemPrice, taxPrice, shippingPrice, totalPrice } = req.body;

  const order = await Order.create({
    user: req.user._id,
    shippingInfo,
    orderItems,
    paymentInfo,
    paidAt: Date.now(),
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  });

  res.status(201).json({
    success: true,
    order
  });
});


// Getting Single Order
export const getSingleOrder = handleAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");
  if (!order) {
    return next(new HandleError("Order not found", 404));
  }
  res.status(200).json({
    success: true,
    order
  });
});

// All my orders
export const allMyOrders = handleAsyncError(async(req, res, next) => {
    const orders = await Order.find({user:req.user._id});
    if (!orders) {
        return next(new HandleError("No order found", 404));
    }
    res.status(200).json({
        success: true,
        orders
    })
})


// Getting all orders
export const getAllOrders = handleAsyncError(async(req, res, next) => {
    const orders = await Order.find();
    let totalAmount = 0;
    orders.forEach(order => {
        totalAmount += order.totalPrice
    })
    res.status(200).json({
        success: true,
        orders,
        totalAmount
    })
})