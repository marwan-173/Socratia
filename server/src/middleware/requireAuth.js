import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  const auth = req.headers.authorization || "";
  const [type, token] = auth.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ ok: false, error: "Missing auth token." });
  }

  const payload = jwt.verify(token, process.env.JWT_SECRET);

  req.user = payload;
  req.userId = payload.userId || payload.sub; // ✅ هذا هو المفتاح

  next();
}
