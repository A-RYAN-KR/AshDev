import express from "express";
import { createOrder, getAllOrders, getOrders } from "../controllers/order.controller";

const orderRouter = express.Router();

// Define the GET route for fetching orders
orderRouter.get("/orders", getAllOrders);

// POST /orders - Create a new order
orderRouter.post("/orders", createOrder);

// Fetch a single order by restaurant ID
orderRouter.get("/orders/:restaurantId", getOrders);

export default orderRouter;
