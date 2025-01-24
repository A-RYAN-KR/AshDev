import express from "express";
import { createTable } from "../controllers/table.controller"; // Adjust path as needed

const tableRouter = express.Router();

// POST route to create a new table
tableRouter.post("/table", createTable);

export default tableRouter;
