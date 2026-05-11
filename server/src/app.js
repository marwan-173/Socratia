import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import fileRoutes from "./routes/file.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

console.log("[APP] Express initializing");

app.use(cors());
console.log("[MIDDLEWARE] CORS enabled");

app.use(express.json());
console.log("[MIDDLEWARE] JSON parser enabled");

app.use("/api/auth", authRoutes);
console.log("[APP] Auth routes mounted at /api/auth");

app.use("/api/files", fileRoutes);
console.log("[APP] File routes mounted at /api/files");

app.use("/api/ai", aiRoutes);
console.log("[APP] AI routes mounted at /api/ai");

app.use("/api/admin", adminRoutes);
console.log("[APP] Admin routes mounted at /api/admin");

app.use("/api/user", userRoutes);
console.log("[APP] User routes mounted at /api/user");
export default app;
