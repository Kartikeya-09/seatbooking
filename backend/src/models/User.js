import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    username: { type: String, required: true, unique: true, lowercase: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    type: { type: String, enum: ["batch1", "batch2"], required: true },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
