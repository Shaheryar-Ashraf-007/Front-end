import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../controllers/productController.js";

const router = Router();

// GET all products
router.get("/", getProducts);

// POST create product
router.post("/", createProduct);

// PUT update product ✅ FIXED
router.put("/update/:productId", updateProduct);

// DELETE product
router.delete("/:productId", deleteProduct);

export default router;