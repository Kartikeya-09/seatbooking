import express from "express";

import Seat from "../models/Seat.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import SeatOverride from "../models/SeatOverride.js";
import authMiddleware from "../middleware/auth.js";
import {
  parseDateInput,
  getAllowedSeatType,
  isBusinessDay,
  canBookSeatType,
} from "../services/bookingRules.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", async (req, res, next) => {
  try {
    const { date } = req.query;
    const seats = await Seat.find().sort({ seatNumber: 1 });

    if (!date) {
      return res.json(seats);
    }

    const parsedDate = parseDateInput(date);
    if (!isBusinessDay(parsedDate)) {
      const result = seats.map((seat) => ({
        ...seat.toObject(),
        isBooked: false,
        isAllowed: false,
      }));
      return res.json(result);
    }

    const bookings = await Booking.find({ date }).select("seat");
    const bookedSeatIds = new Set(bookings.map((booking) => booking.seat.toString()));
    const overrides = await SeatOverride.find({ date }).select("seat type");
    const overrideMap = new Map(
      overrides.map((override) => [override.seat.toString(), override.type])
    );

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const allowedType = getAllowedSeatType(user, parsedDate);
    const windowOpen = canBookSeatType(allowedType, parsedDate);

    const result = seats.map((seat) => {
      const isBooked = bookedSeatIds.has(seat._id.toString());
      const overrideType = overrideMap.get(seat._id.toString());
      const effectiveType = overrideType || seat.type;
      const isAllowed = allowedType ? effectiveType === allowedType && windowOpen : true;
      return {
        ...seat.toObject(),
        type: effectiveType,
        baseType: seat.type,
        isBooked,
        isAllowed,
      };
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
