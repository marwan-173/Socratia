import bcrypt from "bcryptjs";
import User from "../models/User.js";

/* =========================
   Update Email
========================= */
export async function updateEmail(req, res) {
  try {
    const userId = req.userId;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email already in use" });
    }

    await User.findByIdAndUpdate(userId, { email });

    res.json({ ok: true });
  } catch (err) {
    console.error("[USER] updateEmail error:", err);
    res.status(500).json({ message: "Failed to update email" });
  }
}

/* =========================
   Update Password
========================= */
export async function updatePassword(req, res) {
  try {
    const userId = req.userId;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Missing data" });
    }

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    // 1️⃣ جلب المستخدم
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2️⃣ التحقق من كلمة المرور القديمة
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // 3️⃣ تشفير الجديدة
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4️⃣ حفظها
    user.password = hashedPassword;
    await user.save();

    res.json({ ok: true });
  } catch (err) {
    console.error("[USER] updatePassword error:", err);
    res.status(500).json({ message: "Failed to update password" });
  }
}
