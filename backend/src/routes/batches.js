import express from "express";

import Batch from "../models/Batch.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const batches = await Batch.find();
    res.json(batches);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, days, week } = req.body;

    if (!name || !Array.isArray(days) || typeof week !== "number") {
      return res.status(400).json({ message: "name, days, and week are required" });
    }

    const batch = await Batch.create({ name, days, week });
    res.status(201).json(batch);
  } catch (error) {
    next(error);
  }
});

export default router;
