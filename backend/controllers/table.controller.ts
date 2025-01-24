import { Request, Response } from "express";
import { TableModel } from "../models/table.model"; // Adjust path as needed

// Controller for creating a new table
export const createTable = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { number, capacity, status, lastOccupied } = req.body;

    // Validate required fields
    if (!number || !capacity) {
      res
        .status(400)
        .json({ message: "Number and capacity are required fields." });
      return;
    }

    // Check if the table number already exists
    const existingTable = await TableModel.findOne({ number });
    if (existingTable) {
      res
        .status(409)
        .json({ message: "Table with this number already exists." });
      return;
    }

    // Create a new table
    const newTable = new TableModel({
      number,
      capacity,
      status: status || "available",
      lastOccupied: lastOccupied || null,
    });

    // Save to the database
    const savedTable = await newTable.save();
    res.status(201).json({
      message: "Table created successfully.",
      table: savedTable,
    });
  } catch (error) {
    console.error("Error creating table:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
