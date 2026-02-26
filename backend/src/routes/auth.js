import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

const router = express.Router();

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordOk = await bcrypt.compare(password, user.password);
    if (!passwordOk) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        type: user.type,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/register", async (req, res, next) => {
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

router.get("/me", async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Missing auth token" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ message: "Invalid auth token" });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      type: user.type,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
