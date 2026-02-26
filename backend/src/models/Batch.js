import mongoose from "mongoose";

const batchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    days: { type: [Number], required: true },
    week: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Batch", batchSchema);
