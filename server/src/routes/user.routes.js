import express from "express";
import { updateEmail, updatePassword } from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

/* =========================
   User actions
========================= */
router.patch("/email", requireAuth, updateEmail);
router.patch("/password", requireAuth, updatePassword);

export default router;
