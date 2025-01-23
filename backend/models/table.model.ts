// 1. tables.schema.ts
import mongoose, { Schema, Document } from "mongoose";

interface Table extends Document {
  number: number;
  capacity: number;
  status: "available" | "occupied";
  lastOccupied: Date | null;
}

const TableSchema: Schema = new Schema({
  number: { type: Number, required: true, unique: true },
  capacity: { type: Number, required: true },
  status: {
    type: String,
    enum: ["available", "occupied"],
    default: "available",
  },
  lastOccupied: { type: Date, default: null },
});

export const TableModel = mongoose.model<Table>("Table", TableSchema);
