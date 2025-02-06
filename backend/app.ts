require("dotenv").config();

import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middlewares/error";
import userRouter from "./routes/user.route";
import menuRouter from "./routes/menu.route";
import orderRouter from "./routes/order.route";
import tableRouter from "./routes/table.route";
import categoryRouter from "./routes/category.route";
import restaurantRouter from "./routes/restaurant.route";


// body parser
app.use(express.json({ limit: "50mb" }));

// cookie parser
app.use(cookieParser());



app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cors());

// routes
app.use("/api/v1", userRouter);
app.use("/api/v1", menuRouter);
app.use("/api/v1", orderRouter);
app.use("/api/v1", tableRouter);
app.use("/api/v1", categoryRouter);
app.use("/api/v1", restaurantRouter);

// testing api
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});

// unknown route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

app.use(ErrorMiddleware);
