import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import {
  listUsers,
  deleteUser,
  resetUserPassword,
  changeUserRole,
} from "../controllers/admin.controller.js";

console.log("[ROUTE] admin.routes.js loaded");
console.log("[ROUTE] requireAuth =", requireAuth);

const router = express.Router();

// All admin routes require: logged-in + admin
router.get("/users", requireAuth, requireAdmin, listUsers);
router.delete("/users/:id", requireAuth, requireAdmin, deleteUser);
router.patch(
  "/users/:id/password",
  requireAuth,
  requireAdmin,
  resetUserPassword
);
router.patch("/users/:id/role", requireAuth, requireAdmin, changeUserRole);

export default router;
