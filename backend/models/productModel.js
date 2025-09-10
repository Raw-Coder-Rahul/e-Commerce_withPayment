import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product name"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Please enter product price"],
    maxLength: [8, "Price cannot exceed 8 digits"],
  },
  description: {
    type: String,
    required: [true, "Please enter product description"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  image: [
    {
      public_id: {
        type: String,
        required: [true, "Please enter product image public ID"],
      },
      url: {
        type: String,
        required: [true, "Please enter product image URL"],
      },
    },
  ],
    category: {
        type: String,
        required: [true, "Please enter product category"],
    },
    stock: {
        type: Number,
        required: [true, "Please enter product stock"],
        max: [10000, "Stock cannot exceed 10000"],
        min: [0, "Stock cannot be negative"],
        default: 0,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    reviews:
    [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
                required: true,
            },
        },
    ],
    user:{
      type:mongoose.Schema.ObjectId,
      ref:"User",
      required:true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Product", productSchema);