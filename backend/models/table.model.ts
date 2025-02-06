import mongoose, { Schema, Document } from "mongoose";

interface Table extends Document {
  number: number;
  capacity: number;
  status: "available" | "occupied" | "reserved";
  lastOccupied: Date | null;
  restaurant: mongoose.Types.ObjectId; // Reference to Restaurant
}

const TableSchema: Schema = new Schema({
  number: { type: Number, required: true, unique: true },
  capacity: { type: Number, required: true },
  status: {
    type: String,
    enum: ["available", "occupied", "reserved"],
    default: "available",
  },
  lastOccupied: { type: Date, default: null },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
});

export const TableModel = mongoose.model<Table>("Table", TableSchema);
