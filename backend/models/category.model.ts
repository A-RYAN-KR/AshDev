import mongoose, { Schema, Document, model } from "mongoose";

// Define the interface for the Category document
interface ICategory extends Document {
  categoryName: string;
  // restaurant: mongoose.Schema.Types.ObjectId; // Reference to a Restaurant document
  restaurant: string; // Reference to a Restaurant document
}

// Define the schema for the Category model
const CategorySchema: Schema = new Schema(
  {
    categoryName: {
      type: String,
      required: true,
      trim: true,
    },
    // restaurant: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Restaurant", // Reference to the Restaurant model
    //   required: true,
    // },
    restaurant: {
      type: String,
      // ref: "Restaurant", // Reference to the Restaurant model
      required: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create and export the Category model
const Category = model<ICategory>("Category", CategorySchema);
export default Category;
