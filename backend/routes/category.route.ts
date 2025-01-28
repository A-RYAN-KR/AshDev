// category.route.ts
import express from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller";

const categoryRouter = express.Router();

// Define routes for the Category model
categoryRouter.get("/category", getCategories); // Get all categories
categoryRouter.post("/category", createCategory); // Create a new category
categoryRouter.put("/category/:id", updateCategory); // Update a category by ID
categoryRouter.delete("/category/:id", deleteCategory); // Delete a category by ID

export default categoryRouter;
