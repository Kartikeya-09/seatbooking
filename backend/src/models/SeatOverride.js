import mongoose from "mongoose";

const seatOverrideSchema = new mongoose.Schema(
  {
    seat: { type: mongoose.Schema.Types.ObjectId, ref: "Seat", required: true },
    date: { type: String, required: true },
    type: { type: String, enum: ["regular", "floater"], required: true },
  },
  { timestamps: true }
);

seatOverrideSchema.index({ seat: 1, date: 1 }, { unique: true });

export default mongoose.model("SeatOverride", seatOverrideSchema);
