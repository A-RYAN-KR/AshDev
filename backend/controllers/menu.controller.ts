import { Request, Response } from "express";
import { MenuItemModel } from "../models/menu.model";


// Controller to add a new menu item
export const addMenuItem = async (req: Request, res: Response) => {
  try {
    const { name, price, category, description, isAvailable } = req.body;

    const newMenuItem = new MenuItemModel({
      name,
      price,
      category,
      description,
      isAvailable,
    });

    const savedMenuItem = await newMenuItem.save();
    res
      .status(201)
      .json({ message: "Menu item added successfully", data: savedMenuItem });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding menu item", error: error.message });
  }
};

// Controller to fetch all menu items
export const getMenuItems = async (req: Request, res: Response) => {
  try {
    const menuItems = await MenuItemModel.find();
    res.status(200).json({ data: menuItems });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching menu items", error: error.message });
  }
};

export const editMenuItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedItem = await MenuItemModel.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!updatedItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.status(200).json({ data: updatedItem });
  } catch (error) {
    res.status(500).json({ message: "Failed to update menu item", error });
  }
};

export const deleteMenuItem = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedItem = await MenuItemModel.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res
      .status(200)
      .json({ message: "Menu item deleted successfully", data: deletedItem });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete menu item", error });
  }
};

