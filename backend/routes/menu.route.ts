import express from "express";
import {
  addMenuItem,
  getMenuItems,
  editMenuItem,
  deleteMenuItem,
} from "../controllers/menu.controller";

const menuRouter = express.Router();

// Route to add a new menu item
menuRouter.post("/menu", addMenuItem);

// Route to fetch all menu items
menuRouter.get("/menu", getMenuItems);

// Route to edit a menu item by ID
menuRouter.put("/menu/:id", editMenuItem);

// Route to delete a menu item by ID
menuRouter.delete("/menu/:id", deleteMenuItem);

export default menuRouter;
