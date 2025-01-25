import mongoose, { Schema, Document } from "mongoose";

// Define the Table interface
interface Table extends Document {
  number: number;
  capacity: number;
  status: "available" | "occupied" | "reserved";
  lastOccupied: Date | null;
}

// Define the schema for the table
const TableSchema: Schema = new Schema({
  number: { type: Number, required: true, unique: true },
  capacity: { type: Number, required: true },
  status: {
    type: String,
    enum: ["available", "occupied", "reserved"],
    default: "available",
  },
  lastOccupied: { type: Date, default: null },
});

// Export the table model
export const TableModel = mongoose.model<Table>("Table", TableSchema);
