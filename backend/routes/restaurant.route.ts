import express from "express";
import {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
} from "../controllers/restaurant.controller";

const restaurantRouter = express.Router();

restaurantRouter.post("/restaurants", createRestaurant); // Create restaurant
restaurantRouter.get("/restaurants", getRestaurants); // Get all restaurants
restaurantRouter.get("/restaurants/:id", getRestaurantById); // Get restaurant by ID
restaurantRouter.put("/restaurants/:id", updateRestaurant); // Update restaurant
restaurantRouter.delete("/restaurants/:id", deleteRestaurant); // Delete restaurant

export default restaurantRouter;
