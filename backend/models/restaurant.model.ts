import { Schema, model, Document } from "mongoose";

interface IRestaurant extends Document {
  name: string;
  address?: string;
  phone?: string;
  owners: Schema.Types.ObjectId[]; // Array of user IDs
  createdAt: Date;
}

const RestaurantSchema = new Schema<IRestaurant>({
  name: { type: String, required: true },
  address: { type: String },
  phone: { type: String },
  owners: [{ type: Schema.Types.ObjectId, ref: "User" }], // Array of user references
  createdAt: { type: Date, default: Date.now },
});

export default model<IRestaurant>("Restaurant", RestaurantSchema);
