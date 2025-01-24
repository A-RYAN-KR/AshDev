import { Request, Response } from "express";
import mongoose from "mongoose";
import { OrderModel } from "../models/order.model"; // Import the Order model
import { TableModel } from "../models/table.model"; // Import the Table model

// Fetch all orders
export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Registered models:", mongoose.modelNames());

    const orders = await OrderModel.find()
      .populate("table", "number") // Populate the 'table' field with the 'number' field from the Table schema
      .populate("items", "name price"); // Populate the 'items' field with 'name' and 'price' fields from the MenuItem schema

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


export const createOrder = async (req: Request, res: Response) => {
  try {
    const { table, items, total } = req.body;

    // Validate request body
    if (!table || !items || !total) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Create a new order
    const newOrder = new OrderModel({
      table: new mongoose.Types.ObjectId(table),
      items: items.map((item: string) => new mongoose.Types.ObjectId(item)),
      total,
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

