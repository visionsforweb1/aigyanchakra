import { pool, ready, clean, isEmail, isPhone, methodOnly, dbError } from "./_lib.js";

export default async function handler(req, res) {
  if (!methodOnly(req, res, "POST")) return;
  const b = req.body || {};
  const name = clean(b.name);
  const email = clean(b.email).toLowerCase();
  const contact = clean(b.contact);
  const isNcc = b.isNcc === "yes";
  const enrollment = clean(b.enrollment);

  if (!name) return res.status(400).json({ error: "Name is required" });
  if (!isEmail(email)) return res.status(400).json({ error: "Invalid email" });
  if (!isPhone(contact))
    return res.status(400).json({ error: "Invalid contact number" });
  if (isNcc && !enrollment)
    return res.status(400).json({ error: "NCC enrollment number is required" });

  try {
    await ready();
    await pool.query(
      `INSERT INTO registrations (name, email, contact, is_ncc, enrollment_no)
       VALUES ($1, $2, $3, $4, $5)`,
      [name, email, contact, isNcc, isNcc ? enrollment : null],
    );
    res.json({ ok: true });
  } catch (e) {
    dbError(res, e);
  }
}
