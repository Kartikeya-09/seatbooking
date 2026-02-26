import mongoose from "mongoose";

const squadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.model("Squad", squadSchema);
