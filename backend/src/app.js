import express from "express";
import cors from "cors";
import morgan from "morgan";

import userRoutes from "./routes/users.js";
import squadRoutes from "./routes/squads.js";
import batchRoutes from "./routes/batches.js";
import seatRoutes from "./routes/seats.js";
import bookingRoutes from "./routes/bookings.js";
import authRoutes from "./routes/auth.js";

const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(morgan("dev"));

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/users", userRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/squads", squadRoutes);
  app.use("/api/batches", batchRoutes);
  app.use("/api/seats", seatRoutes);
  app.use("/api/bookings", bookingRoutes);

  app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
  });

  app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({ message: err.message || "Server error" });
  });

  return app;
};

export { createApp };
