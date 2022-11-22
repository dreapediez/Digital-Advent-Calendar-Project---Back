import "../loadEnvironments.js";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import allowedOrigins from "./allowedOrigins/allowedOrigins.js";

const app = express();

app.use(
  cors({
    origin: allowedOrigins,
  })
);

app.disable("x-powered-by");

app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res, next) => {
  res.json({
    message: "Pong 🏓",
  });

  next();
});

export default app;
