import mongoose, { Schema, Document } from "mongoose";

interface Order extends Document {
  table: mongoose.Types.ObjectId; // Refers to a Table
  items: mongoose.Types.ObjectId[]; // Refers to MenuItems
  total: number;
  status: "pending" | "completed" | "cancelled";
  time: Date;
  restaurant: mongoose.Types.ObjectId; // Reference to Restaurant
}

const OrderSchema: Schema = new Schema({
  table: { type: mongoose.Schema.Types.ObjectId, ref: "Table", required: true },
  items: [
    { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
  ],
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending",
  },
  time: { type: Date, default: Date.now },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
});

export const OrderModel = mongoose.model<Order>("Order", OrderSchema);
