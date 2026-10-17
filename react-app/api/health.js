import { pool, ready } from "./_lib.js";

export default async function handler(_req, res) {
  try {
    await ready();
    await pool.query("SELECT 1");
    res.json({ ok: true, database: "connected" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "Database not reachable" });
  }
}
