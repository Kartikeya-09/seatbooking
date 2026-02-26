import express from "express";
import bcrypt from "bcryptjs";

import User from "../models/User.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const users = await User.find().select("name username email type");
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get("/me", authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("name username email type");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      type: user.type,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, username, email, password, type } = req.body;

    if (!username || !email || !password || !type) {
      return res
        .status(400)
        .json({ message: "username, email, password, and type are required" });
    }

    if (!/^(batch1|batch2)$/.test(type)) {
      return res.status(400).json({ message: "type must be batch1 or batch2" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name || "",
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: passwordHash,
      type,
    });

    res.status(201).json({
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      type: user.type,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Username or email already exists" });
    }
    next(error);
  }
});

export default router;
