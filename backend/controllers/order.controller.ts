import { Request, Response } from "express";
import mongoose from "mongoose";
import { OrderModel } from "../models/order.model";
import { MenuItemModel } from "../models/menu.model";

// Fetch all orders
export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await OrderModel.find()
      .populate("table", "number")
      .populate("items", "name price category");

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};



export const createOrder = async (req: Request, res: Response) => {
  try {
    const { table, items, status, restaurant } = req.body; // Extract restaurant ID from body

    // Validate request body
    if (
      !table ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !restaurant
    ) {
      return res
        .status(400)
        .json({ message: "Missing or invalid required fields." });
    }

    // Fetch menu items to calculate total
    const menuItems = await MenuItemModel.find({ _id: { $in: items } });

    if (menuItems.length !== items.length) {
      return res
        .status(400)
        .json({ message: "One or more items are invalid." });
    }

    // Calculate total price
    const total = menuItems.reduce((sum, item) => sum + item.price, 0);

    // Ensure status is set, default to "pending" if not provided
    const orderStatus =
      status && ["pending", "completed", "cancelled"].includes(status)
        ? status
        : "pending";

    // Create a new order
    const newOrder = new OrderModel({
      table: new mongoose.Types.ObjectId(table),
      items: items.map((item: string) => new mongoose.Types.ObjectId(item)),
      total,
      status: orderStatus,
      restaurant: new mongoose.Types.ObjectId(restaurant), // Assign restaurant ID from body
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: "Order created successfully.",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// fetch a particular order by restaurant ID
export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const { restaurantId } = req.params; // Extract restaurantId from URL

    if (!restaurantId) {
      res
        .status(400)
        .json({ message: "Restaurant ID is required in the URL." });
      return;
    }

    const orders = await OrderModel.find({ restaurant: restaurantId })
      .populate("table", "number")
      .populate("items", "name price category");

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
