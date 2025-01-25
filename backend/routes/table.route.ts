import express from "express";
import {
  createTable,
  getTables,
  updateTable,
  deleteTable,
} from "../controllers/table.controller";

const tableRouter = express.Router();

tableRouter.post("/createTable", createTable);
tableRouter.get("/getAllTables", getTables);
tableRouter.put("/updateTable/:id", updateTable);
tableRouter.delete("/deleteTable/:id", deleteTable);

export default tableRouter;
