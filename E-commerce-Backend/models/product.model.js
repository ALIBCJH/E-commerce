// models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Product image is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      enum: [
        "Clothes",
        "Electronics",
        "Bags",
        "Beauty Products",
        "Furniture",
        "Stationery",
        "Books",
        "Mobile Accessories",
        "Shoes",
      ],
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// Explicitly define collection name to avoid mismatch
const Product = mongoose.model("Product", productSchema, "products");

export default Product;
