import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

// Public routes
router.get("/:id", getProductById);
router.post("/", createProduct);
router.get("/", getProducts);
router.delete("/:id", deleteProduct);

// Protected routes

export default router;
