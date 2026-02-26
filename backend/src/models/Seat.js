import mongoose from "mongoose";

const seatSchema = new mongoose.Schema(
  {
    seatNumber: { type: Number, required: true, unique: true },
    type: { type: String, enum: ["regular", "floater"], required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Seat", seatSchema);
