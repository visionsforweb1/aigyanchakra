import { pool, ready, requireAdmin, methodOnly, dbError } from "../_lib.js";

// only these table names are allowed (never put user input into the SQL)
const TABLES = ["registrations", "volunteers", "centres"];

// GET /api/admin/registrations | volunteers | centres  (admin only)
export default async function handler(req, res) {
  if (!methodOnly(req, res, "GET")) return;
  if (!requireAdmin(req, res)) return;
  const table = req.query.table;
  if (!TABLES.includes(table))
    return res.status(404).json({ error: "Not found" });
  try {
    await ready();
    const { rows } = await pool.query(
      `SELECT * FROM ${table} ORDER BY id ASC`,
    );
    res.json(rows);
  } catch (e) {
    dbError(res, e);
  }
}
