import express from "express";

import Squad from "../models/Squad.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const squads = await Squad.find();
    res.json(squads);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const squad = await Squad.create({ name });
    res.status(201).json(squad);
  } catch (error) {
    next(error);
  }
});

export default router;
