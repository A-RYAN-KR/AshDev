// 2. menu.schema.ts
import mongoose, { Schema, Document } from "mongoose";

interface MenuItem extends Document {
  name: string;
  price: number;
  category: string;
  description: string;
  isAvailable: boolean;
}

const MenuItemSchema: Schema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String },
  isAvailable: { type: Boolean, default: true },
});

export const MenuItemModel = mongoose.model<MenuItem>(
  "MenuItem",
  MenuItemSchema
);
