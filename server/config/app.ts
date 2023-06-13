const bodyParser = require("body-parser");
import express, { NextFunction, Request, Response } from "express";
import fs from "fs";
import gracefulFs from "graceful-fs";
import errorHandlers from "../middleware/error_handlers";
import routes from "../routes";
import { applyMiddleware, applyRoutes } from "../utils";
import path from "path";
gracefulFs.gracefulify(fs);

const app = express();
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.static("asset"));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

applyRoutes(routes, app);
applyMiddleware(errorHandlers, app);

export default app;
