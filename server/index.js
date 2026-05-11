import dotenv from "dotenv";
import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";

console.log("[SERVER] Loading environment variables");
dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  console.log("[SERVER] Initializing server...");

  await connectDB();

  app.listen(PORT, () => {
    console.log(`[SERVER] Listening on http://localhost:${PORT}`);
  });
}

startServer();
