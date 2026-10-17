import { methodOnly, safeEqual, makeToken } from "../_lib.js";

export default async function handler(req, res) {
  if (!methodOnly(req, res, "POST")) return;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword)
    return res.status(500).json({ error: "ADMIN_PASSWORD is not set" });
  // small delay to slow down password guessing
  await new Promise((r) => setTimeout(r, 400));
  const given = (req.body && req.body.password) || "";
  if (!safeEqual(given, adminPassword))
    return res.status(401).json({ error: "Wrong password" });
  res.json({ token: makeToken() });
}
