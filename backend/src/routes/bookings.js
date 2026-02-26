import express from "express";

import Booking from "../models/Booking.js";
import Seat from "../models/Seat.js";
import User from "../models/User.js";
import SeatOverride from "../models/SeatOverride.js";
import authMiddleware from "../middleware/auth.js";
import {
  parseDateInput,
  getAllowedSeatType,
  isBusinessDay,
  canBookSeatType,
  canCancelBooking,
} from "../services/bookingRules.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", async (req, res, next) => {
  try {
    const { date } = req.query;
    const query = {};

    if (date) {
      parseDateInput(date);
      query.date = date;
    }

    query.user = req.user.id;

    const bookings = await Booking.find(query)
      .populate("user")
      .populate("seat")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { seatId, date } = req.body;

    if (!seatId || !date) {
      return res.status(400).json({ message: "seatId and date are required" });
    }

    const parsedDate = parseDateInput(date);
    if (!isBusinessDay(parsedDate)) {
      return res.status(400).json({ message: "No booking allowed on weekends" });
    }

    const [user, seat] = await Promise.all([
      User.findById(req.user.id),
      Seat.findById(seatId),
    ]);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!seat) {
      return res.status(404).json({ message: "Seat not found" });
    }

    const override = await SeatOverride.findOne({ seat: seatId, date });
    const effectiveType = override ? override.type : seat.type;

    const allowedType = getAllowedSeatType(user, parsedDate);
    if (effectiveType !== allowedType) {
      return res.status(400).json({ message: `Seat not allowed for ${date}` });
    }

    if (!canBookSeatType(seat.type, parsedDate)) {
      return res.status(400).json({ message: "Booking window is closed" });
    }

    const booking = await Booking.create({
      user: req.user.id,
      seat: seatId,
      date,
    });

    res.status(201).json(booking);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Seat or user already booked for this date" });
    }
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findOne({ _id: id, user: req.user.id });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const bookingDate = parseDateInput(booking.date);
    if (!canCancelBooking(bookingDate)) {
      return res.status(400).json({ message: "Cannot cancel on or after booking date" });
    }

    const seat = await Seat.findById(booking.seat);
    if (seat && seat.type === "regular") {
      await SeatOverride.updateOne(
        { seat: seat._id, date: booking.date },
        { $set: { type: "flex" } },
        { upsert: true }
      );
    }

    await Booking.deleteOne({ _id: id });

    res.json({ message: "Booking cancelled" });
  } catch (error) {
    next(error);
  }
});

export default router;
