import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import { connectDb } from "./config/db.js";
import Batch from "./models/Batch.js";
import Squad from "./models/Squad.js";
import Seat from "./models/Seat.js";
import User from "./models/User.js";

dotenv.config();

const seed = async () => {
  await connectDb(process.env.MONGODB_URI);

  await Promise.all([
    Batch.deleteMany({}),
    Squad.deleteMany({}),
    Seat.deleteMany({}),
    User.deleteMany({}),
  ]);

  const squads = await Squad.insertMany(
    Array.from({ length: 10 }, (_, index) => ({
      name: `Squad ${index + 1}`,
    }))
  );

  await Batch.insertMany([
    { name: "Batch 1", days: [1, 2, 3], week: 1 },
    { name: "Batch 2", days: [4, 5], week: 2 },
  ]);

  await Seat.insertMany(
    Array.from({ length: 50 }, (_, index) => ({
      seatNumber: index + 1,
      type: index < 40 ? "regular" : "flex",
    }))
  );

  const passwordHash = await bcrypt.hash("Password@123", 10);

  const users = Array.from({ length: 50 }, (_, index) => {
    const userNumber = index + 1;
    const squad = squads[Math.floor(index / 5)];
    const type = userNumber <= 25 ? "batch1" : "batch2";

    return {
      name: `User ${userNumber}`,
      username: `user${userNumber}`,
      email: `user${userNumber}@seatflow.local`,
      password: passwordHash,
      type,
    };
  });

  await User.insertMany(users);

  console.log("Seed complete");
  process.exit(0);
};

seed().catch((error) => {
  console.error("Seed failed", error);
  process.exit(1);
});
