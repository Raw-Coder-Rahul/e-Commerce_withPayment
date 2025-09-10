import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    orderItems: [
      {
        name: {
          type: String,
          required: true
        },
        quantity: {
          type: Number,
          required: true
        },
        price: {
          type: Number,
          required: true
        },
        image: {
            type: String,
            required: true
        },
        product:{
            type: mongoose.Schema.ObjectId,
            ref: "Product",
            required: true
        }
      }
    ],
    shippingInfo: {
      address: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      country: {
        type: String,
        required: true
      },
      pinCode: {
        type: Number,
        required: true
      },
      phoneNo:{
        type: Number,
        required: true
      }
    },
    paymentInfo: {
      id: {
        type: String,
        required: true
      },
      status: {
        type: String,
        required: true
      }
    },
    paidAt: {
      type: Date,
      required: true
    },
    itemPrice: {
      type: Number,
      required: true,
      default: 0
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0
    },
    orderStatus: {
      type: String,
      required: true,
      default: "Processing"
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0
    },
    deliveredAt: Date,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
