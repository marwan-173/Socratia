import bcrypt from "bcryptjs";
import User from "../models/User.js";

export async function listUsers(req, res) {
  try {
    const users = await User.find({})
      .select("_id username email role createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      ok: true,
      users: users.map((u) => ({
        id: u._id.toString(),
        username: u.username,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt,
      })),
    });
  } catch {
    return res.status(500).json({ ok: false, error: "Server error." });
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themself (optional but safer)
    if (req.user?.sub === id) {
      return res
        .status(400)
        .json({ ok: false, error: "You cannot delete your own account." });
    }

    const deleted = await User.findByIdAndDelete(id).lean();
    if (!deleted) {
      return res.status(404).json({ ok: false, error: "User not found." });
    }

    return res.status(200).json({ ok: true, message: "User deleted." });
  } catch {
    return res.status(500).json({ ok: false, error: "Server error." });
  }
}

export async function resetUserPassword(req, res) {
  try {
    const { id } = req.params;
    const { newPassword } = req.body || {};

    if (
      !newPassword ||
      typeof newPassword !== "string" ||
      newPassword.length < 8
    ) {
      return res.status(400).json({
        ok: false,
        error: "newPassword is required (min 8 characters).",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ ok: false, error: "User not found." });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = passwordHash;
    await user.save();

    return res
      .status(200)
      .json({ ok: true, message: "Password reset successfully." });
  } catch {
    return res.status(500).json({ ok: false, error: "Server error." });
  }
}

export async function changeUserRole(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.body || {};

    const allowed = ["user", "admin"];
    if (!allowed.includes(role)) {
      return res
        .status(400)
        .json({ ok: false, error: "Role must be 'user' or 'admin'." });
    }

    // Prevent admin from demoting themself (optional but safer)
    if (req.user?.sub === id && role !== "admin") {
      return res
        .status(400)
        .json({ ok: false, error: "You cannot remove your own admin role." });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ ok: false, error: "User not found." });
    }

    user.role = role;
    await user.save();

    return res.status(200).json({
      ok: true,
      message: "Role updated.",
      user: { id: user._id.toString(), role: user.role },
    });
  } catch {
    return res.status(500).json({ ok: false, error: "Server error." });
  }
}
