import express from "express";
import {
  register,
  login,
  forgetPassword,
  verifyResetCode,
  resetPassword,
} from "../controllers/auth.controller.js";

const router = express.Router();

console.log("[ROUTE] Auth routes initialized");

router.post("/register", register);
router.post("/login", login);
router.post("/forget-password", forgetPassword);
router.post("/verify-reset-code", verifyResetCode);
router.post("/reset-password", resetPassword);
export default router;
