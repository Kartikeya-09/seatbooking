import dotenv from "dotenv";

import { connectDb } from "./src/config/db.js";
import { createApp } from "./src/app.js";

dotenv.config();

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  await connectDb(process.env.MONGODB_URI);

  const app = createApp();

  app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
