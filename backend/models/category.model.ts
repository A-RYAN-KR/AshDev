import mongoose, { Schema, Document, model } from "mongoose";

interface ICategory extends Document {
  categoryName: string;
  restaurant: mongoose.Schema.Types.ObjectId; // Reference to Restaurant
}

const CategorySchema: Schema = new Schema(
  {
    categoryName: {
      type: String,
      required: true,
      trim: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant", // Reference to the Restaurant model
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Category = model<ICategory>("Category", CategorySchema);
export default Category;
