// 3. orders.schema.ts
import mongoose, { Schema, Document } from "mongoose";

interface Order extends Document {
  table: mongoose.Types.ObjectId; // Refers to a Table
  items: mongoose.Types.ObjectId[]; // Refers to MenuItems
  total: number;
  status: "pending" | "completed" | "cancelled";
  time: Date;
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
});

export const OrderModel = mongoose.model<Order>("Order", OrderSchema);
