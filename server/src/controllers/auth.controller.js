import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  sendPasswordResetEmail,
  generateVerificationCode,
  generateResetToken,
} from "../services/email.service.js";

console.log("[CONTROLLER] Auth controller loaded");

/* =========================
   REGISTER
========================= */
export async function register(req, res) {
  console.log("[AUTH][REGISTER] Request received");

  try {
    const {
      username,
      firstName,
      lastName,
      dateOfBirth,
      email,
      password,
      confirmPassword,
    } = req.body;

    if (
      !username ||
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      console.log("[AUTH][REGISTER] Missing fields");
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    if (password !== confirmPassword) {
      console.log("[AUTH][REGISTER] Passwords do not match");
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    console.log("[AUTH][REGISTER] Checking existing user");

    const exists = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (exists) {
      console.log("[AUTH][REGISTER] User already exists");
      return res.status(400).json({
        message: "User already exists",
      });
    }

    console.log("[AUTH][REGISTER] Hashing password");

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("[AUTH][REGISTER] Creating user");

    const user = await User.create({
      username,
      firstName,
      lastName,
      dateOfBirth,
      email,
      password: hashedPassword,
    });

    console.log("[AUTH][REGISTER] Success:", user._id.toString());

    return res.status(201).json({
      message: "User created successfully",
    });
  } catch (err) {
    console.error("[AUTH][REGISTER] ERROR");
    console.error(err);

    return res.status(500).json({
      message: "Server error",
    });
  }
}

/* =========================
   LOGIN
========================= */
export async function login(req, res) {
  console.log("[AUTH][LOGIN] Request received");

  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      console.log("[AUTH][LOGIN] Missing credentials");
      return res.status(400).json({
        message: "Missing credentials",
      });
    }

    console.log("[AUTH][LOGIN] Searching for user");

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    }).select("+password");

    if (!user) {
      console.log("[AUTH][LOGIN] User not found");
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    console.log("[AUTH][LOGIN] Comparing passwords");

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("[AUTH][LOGIN] Password mismatch");
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    console.log("[AUTH][LOGIN] Creating JWT");

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role || "user", // ⬅️ هذا هو الإصلاح
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("[AUTH][LOGIN] Success:", user._id.toString());

    return res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role || "user",
      },
    });
  } catch (err) {
    console.error("[AUTH][LOGIN] ERROR");
    console.error(err);

    return res.status(500).json({
      message: "Server error",
    });
  }
}
/* =========================
   FORGET PASSWORD - SEND CODE
========================= */
export async function forgetPassword(req, res) {
  console.log("[AUTH][FORGET_PASSWORD] Request received");

  try {
    const { email } = req.body;

    if (!email) {
      console.log("[AUTH][FORGET_PASSWORD] Missing email");
      return res.status(400).json({
        message: "Email is required",
      });
    }

    console.log("[AUTH][FORGET_PASSWORD] Finding user");

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log("[AUTH][FORGET_PASSWORD] User not found");
      // Don't reveal if user exists for security
      return res.json({
        message: "If this email exists, a password reset code will be sent",
      });
    }

    console.log("[AUTH][FORGET_PASSWORD] Generating reset code");

    const resetCode = generateVerificationCode();
    const resetToken = generateResetToken();
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // 🔑 MOCK: Log the code to console instead of sending email
    console.log(
      `\n🔑 MOCK EMAIL: Password reset code for ${user.email}: ${resetCode}\n`
    );

    console.log("[AUTH][FORGET_PASSWORD] Updating user with reset data");

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        resetPasswordCode: resetCode,
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires,
      },
      { new: true }
    );

    if (!updatedUser) {
      console.error("[AUTH][FORGET_PASSWORD] Failed to update user");
      return res.status(500).json({
        message: "Failed to send reset code",
      });
    }

    console.log("[AUTH][FORGET_PASSWORD] Success - Code stored in DB");

    return res.json({
      message: "Password reset code sent to your email (check server console)",
    });
  } catch (err) {
    console.error("[AUTH][FORGET_PASSWORD] ERROR");
    console.error(err);

    return res.status(500).json({
      message: "Server error",
    });
  }
}

/* =========================
   VERIFY RESET CODE
========================= */
export async function verifyResetCode(req, res) {
  console.log("[AUTH][VERIFY_RESET_CODE] Request received");

  try {
    const { email, code } = req.body;

    if (!email || !code) {
      console.log("[AUTH][VERIFY_RESET_CODE] Missing fields");
      return res.status(400).json({
        message: "Email and code are required",
      });
    }

    console.log("[AUTH][VERIFY_RESET_CODE] Finding user");

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log("[AUTH][VERIFY_RESET_CODE] User not found");
      return res.status(401).json({
        message: "Invalid email or code",
      });
    }

    console.log("[AUTH][VERIFY_RESET_CODE] Checking code validity");

    // Check if code exists and hasn't expired
    if (
      !user.resetPasswordCode ||
      user.resetPasswordCode !== code ||
      !user.resetPasswordExpires ||
      new Date() > user.resetPasswordExpires
    ) {
      console.log("[AUTH][VERIFY_RESET_CODE] Code invalid or expired");
      return res.status(401).json({
        message: "Invalid or expired code",
      });
    }

    console.log("[AUTH][VERIFY_RESET_CODE] Code verified successfully");

    return res.json({
      message: "Code verified",
      resetToken: user.resetPasswordToken,
    });
  } catch (err) {
    console.error("[AUTH][VERIFY_RESET_CODE] ERROR");
    console.error(err);

    return res.status(500).json({
      message: "Server error",
    });
  }
}

/* =========================
   RESET PASSWORD
========================= */
export async function resetPassword(req, res) {
  console.log("[AUTH][RESET_PASSWORD] Request received");

  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      console.log("[AUTH][RESET_PASSWORD] Missing fields");
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    if (newPassword !== confirmPassword) {
      console.log("[AUTH][RESET_PASSWORD] Passwords do not match");
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    if (newPassword.length < 6) {
      console.log("[AUTH][RESET_PASSWORD] Password too short");
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    console.log("[AUTH][RESET_PASSWORD] Finding user");

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      console.log("[AUTH][RESET_PASSWORD] User not found");
      return res.status(401).json({
        message: "Invalid email or code",
      });
    }

    console.log("[AUTH][RESET_PASSWORD] Code validation passed");

    console.log("[AUTH][RESET_PASSWORD] Hashing new password");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    console.log("[AUTH][RESET_PASSWORD] Updating user password in database");
    console.log("[AUTH][RESET_PASSWORD] User ID:", user._id.toString());

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        password: hashedPassword,
        resetPasswordCode: null,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
      { new: true }
    );

    if (!updatedUser) {
      console.error("[AUTH][RESET_PASSWORD] Failed to update user");
      return res.status(500).json({
        message: "Failed to update password",
      });
    }

    console.log(
      "[AUTH][RESET_PASSWORD] ✅ SUCCESS - Password updated for user:",
      updatedUser.email
    );

    return res.json({
      message: "Password reset successfully",
    });
  } catch (err) {
    console.error("[AUTH][RESET_PASSWORD] ERROR");
    console.error(err);

    return res.status(500).json({
      message: "Server error",
    });
  }
}
