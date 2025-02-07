import { Request, Response } from "express";
import Restaurant from "../models/restaurant.model";
import userModel from "../models/user.model";
import mongoose from "mongoose";

// Create a new restaurant
export const createRestaurant = async (req: Request, res: Response) => {
  try {
    const { name, address, phone, owners } = req.body;

    if (!name || !owners || !Array.isArray(owners) || owners.length === 0) {
      return res
        .status(400)
        .json({ message: "Name and at least one owner are required." });
    }

    // Validate owner IDs
    const validOwners = await userModel.find({ _id: { $in: owners } });
    if (validOwners.length !== owners.length) {
      return res.status(400).json({ message: "Some owners do not exist." });
    }

    const restaurant = new Restaurant({ name, address, phone, owners });
    await restaurant.save();

    res
      .status(201)
      .json({ message: "Restaurant created successfully", restaurant });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating restaurant", error: error.message });
  }
};

// Get all restaurants
export const getRestaurants = async (_req: Request, res: Response) => {
  try {
    const restaurants = await Restaurant.find().populate(
      "owners",
      "name email"
    );
    res.status(200).json(restaurants);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching restaurants", error: error.message });
  }
};

// Get a single restaurant by ID
export const getRestaurantById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid restaurant ID" });
    }

    const restaurant = await Restaurant.findById(id).populate(
      "owners",
      "name email"
    );

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json(restaurant);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching restaurant", error: error.message });
  }
};

// Update a restaurant
export const updateRestaurant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, address, phone, owners } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid restaurant ID" });
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      id,
      { name, address, phone, owners },
      { new: true }
    );

    if (!updatedRestaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json({ message: "Restaurant updated", updatedRestaurant });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating restaurant", error: error.message });
  }
};

// Delete a restaurant
export const deleteRestaurant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid restaurant ID" });
    }

    const deletedRestaurant = await Restaurant.findByIdAndDelete(id);

    if (!deletedRestaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json({ message: "Restaurant deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting restaurant", error: error.message });
  }
};

// Get all restaurants where the logged-in user is an owner
export const getMyRestaurants = async (req: Request, res: Response) => {
  try {
    const userId = req.headers.authorization?.split(" ")[1]; // Extract token from "Bearer <token>"

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Invalid token or user not found" });
    }

    // Fetch restaurants owned by this user
    const restaurants = await Restaurant.find({ owners: userId }).populate(
      "owners",
      "name email"
    );

    if (!restaurants.length) {
      return res
        .status(404)
        .json({ message: "No restaurants found for this user" });
    }

    res.status(200).json(restaurants);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching restaurants", error: error.message });
  }
};