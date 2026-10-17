import { pool, ready, clean, isPhone, methodOnly, dbError } from "./_lib.js";

export default async function handler(req, res) {
  if (!methodOnly(req, res, "POST")) return;
  const b = req.body || {};
  const centreName = clean(b.centreName);
  const contact = clean(b.contact);
  const district = clean(b.district);
  const capacity = parseInt(b.capacity, 10);

  if (!centreName)
    return res.status(400).json({ error: "Centre name is required" });
  if (!isPhone(contact))
    return res.status(400).json({ error: "Invalid contact number" });
  if (!district) return res.status(400).json({ error: "District is required" });
  if (!(capacity > 0))
    return res.status(400).json({ error: "Invalid auditorium capacity" });

  try {
    await ready();
    await pool.query(
      `INSERT INTO centres (centre_name, contact, district, capacity)
       VALUES ($1, $2, $3, $4)`,
      [centreName, contact, district, capacity],
    );
    res.json({ ok: true });
  } catch (e) {
    dbError(res, e);
  }
}
