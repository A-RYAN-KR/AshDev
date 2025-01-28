// category.controller.ts
import { Request, Response } from "express";
import Category from "../models/category.model";

// Get all categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
};

// Create a new category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { categoryName, restaurant } = req.body;

    if (!categoryName || !restaurant) {
      return res
        .status(400)
        .json({ message: "categoryName and restaurant are required" });
    }

    const newCategory = new Category({ categoryName, restaurant });
    await newCategory.save();

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: "Error creating category", error });
  }
};

// Update a category by ID
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { categoryName, restaurant } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { categoryName, restaurant },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: "Error updating category", error });
  }
};

// Delete a category by ID
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error });
  }
};
