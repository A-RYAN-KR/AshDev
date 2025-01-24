import express from "express";
import { createOrder, getOrders } from "../controllers/order.controller";

const orderRouter = express.Router();

// Define the GET route for fetching orders
orderRouter.get("/orders", getOrders);

// POST /orders - Create a new order
orderRouter.post("/orders", createOrder);

export default orderRouter;
