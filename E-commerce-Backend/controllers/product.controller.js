import Products from "../models/product.model.js";
import mongoose from "mongoose";

// 👇 Define allowed categories
const allowedCategories = [
  "Clothes",
  "Electronics",
  "Bags",
  "Beauty Products",
  "Furniture",
  "Stationery",
  "Shoes",
];

//  Get all products (with optional filtering by category)
export const getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    let filter = {};

    if (category) {
      if (!allowedCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          message: `Invalid category. Allowed categories are: ${allowedCategories.join(", ")}`,
        });
      }
      filter.category = category;
    }

    const products = await Products.find(filter);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//  Get single product by ID
export const getProductById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid product ID" });
  }

  try {
    const product = await Products.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error("Error fetching product:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//  Create a new product
export const createProduct = async (req, res) => {
  const { name, price, image, description, category } = req.body;

  if (!name || !price || !image || !description || !category) {
    return res.status(400).json({
      success: false,
      message: "All fields (name, price, image, description, category) are required",
    });
  }

  if (!allowedCategories.includes(category)) {
    return res.status(400).json({
      success: false,
      message: `Invalid category. Allowed categories are: ${allowedCategories.join(", ")}`,
    });
  }

  try {
    const newProduct = new Products({
      name,
      price,
      image,
      category,
      description,
    });

    await newProduct.save();
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error("Error creating product:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//  Update a product
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, image, description, category } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid product ID" });
  }

  if (!name || !price || !image || !description || !category) {
    return res.status(400).json({
      success: false,
      message: "All fields (name, price, image, description, category) are required",
    });
  }

  if (!allowedCategories.includes(category)) {
    return res.status(400).json({
      success: false,
      message: `Invalid category. Allowed categories are: ${allowedCategories.join(", ")}`,
    });
  }

  try {
    const updatedProduct = await Products.findByIdAndUpdate(
      id,
      { name, price, image, category,description  },
      { new: true }
    );

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//  Delete a product
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid product ID" });
  }

  try {
    const deleted = await Products.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
