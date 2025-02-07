import { Request, Response } from "express";
import { TableModel } from "../models/table.model";
import mongoose from "mongoose";

// Create a new table
export const createTable = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { number, capacity, status, lastOccupied, restaurant } = req.body;

    // Validate required fields
    if (!number || !capacity || !restaurant) {
      res.status(400).json({
        success: false,
        message: "Number, capacity, and restaurant ID are required.",
      });
      return;
    }

    // Check if a table with the same number exists for the same restaurant
    const existingTable = await TableModel.findOne({ number, restaurant });
    if (existingTable) {
      res.status(409).json({
        success: false,
        message: "Table with this number already exists for this restaurant.",
      });
      return;
    }

    const newTable = new TableModel({
      number,
      capacity,
      status: status || "available",
      lastOccupied: lastOccupied || null,
      restaurant: new mongoose.Types.ObjectId(restaurant), // Assign restaurant ID
    });

    const savedTable = await newTable.save();
    res.status(201).json({
      success: true,
      message: "Table created successfully.",
      data: savedTable,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

// Get all tables
export const getTables = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const tables = await TableModel.find();
    res.status(200).json({ success: true, data: tables });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Internal server error.",
        error: error.message,
      });
  }
};

// Update a table
export const updateTable = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedTable = await TableModel.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!updatedTable) {
      res.status(404).json({ success: false, message: "Table not found." });
      return;
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Table updated successfully.",
        data: updatedTable,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Internal server error.",
        error: error.message,
      });
  }
};

// Delete a table
export const deleteTable = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const deletedTable = await TableModel.findByIdAndDelete(id);
    if (!deletedTable) {
      res.status(404).json({ success: false, message: "Table not found." });
      return;
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Table deleted successfully.",
        data: deletedTable,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Internal server error.",
        error: error.message,
      });
  }
};
