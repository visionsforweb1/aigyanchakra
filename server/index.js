import express from "express";
import cors from "cors";
import pg from "pg";
import crypto from "node:crypto";
import "dotenv/config";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const app = express();
app.use(cors());
app.use(express.json());

const isEmail = (v) => /^\S+@\S+\.\S+$/.test(v || "");
// Indian mobile number: exactly 10 digits, starting with 6-9
const isPhone = (v) => /^[6-9]\d{9}$/.test(v || "");
const clean = (v) => (typeof v === "string" ? v.trim() : "");

// handles "already registered" and other DB errors the same way everywhere
const handleError = (res, e) => {
  if (e.code === "23505")
    return res.status(409).json({ error: "This email is already registered" });
  console.error(e);
  res.status(500).json({ error: "Server error, please try again" });
};

// shared by /api/register and /api/volunteer
const personRoute = (table) => async (req, res) => {
  const name = clean(req.body.name);
  const email = clean(req.body.email).toLowerCase();
  const contact = clean(req.body.contact);
  const isNcc = req.body.isNcc === "yes";
  const enrollment = clean(req.body.enrollment);

  if (!name) return res.status(400).json({ error: "Name is required" });
  if (!isEmail(email)) return res.status(400).json({ error: "Invalid email" });
  if (!isPhone(contact))
    return res.status(400).json({ error: "Invalid contact number" });
  if (isNcc && !enrollment)
    return res.status(400).json({ error: "NCC enrollment number is required" });

  try {
    await pool.query(
      `INSERT INTO ${table} (name, email, contact, is_ncc, enrollment_no)
       VALUES ($1, $2, $3, $4, $5)`,
      [name, email, contact, isNcc, isNcc ? enrollment : null],
    );
    res.json({ ok: true });
  } catch (e) {
    handleError(res, e);
  }
};

app.post("/api/register", personRoute("registrations"));
app.post("/api/volunteer", personRoute("volunteers"));

app.post("/api/centre", async (req, res) => {
  const centreName = clean(req.body.centreName);
  const contact = clean(req.body.contact);
  const district = clean(req.body.district);
  const capacity = parseInt(req.body.capacity, 10);

  if (!centreName)
    return res.status(400).json({ error: "Centre name is required" });
  if (!isPhone(contact))
    return res.status(400).json({ error: "Invalid contact number" });
  if (!district) return res.status(400).json({ error: "District is required" });
  if (!(capacity > 0))
    return res.status(400).json({ error: "Invalid auditorium capacity" });

  try {
    await pool.query(
      `INSERT INTO centres (centre_name, contact, district, capacity)
       VALUES ($1, $2, $3, $4)`,
      [centreName, contact, district, capacity],
    );
    res.json({ ok: true });
  } catch (e) {
    handleError(res, e);
  }
});

// ---------- admin ----------
const sessions = new Map(); // token -> expiry time
const SESSION_MS = 8 * 60 * 60 * 1000; // 8 hours

const safeEqual = (a, b) => {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};

app.post("/api/admin/login", async (req, res) => {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword)
    return res.status(500).json({ error: "ADMIN_PASSWORD is not set" });
  // small delay to slow down password guessing
  await new Promise((r) => setTimeout(r, 400));
  if (!safeEqual(req.body.password || "", adminPassword))
    return res.status(401).json({ error: "Wrong password" });
  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, Date.now() + SESSION_MS);
  res.json({ token });
});

const requireAdmin = (req, res, next) => {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  const expiry = sessions.get(token);
  if (!expiry || expiry < Date.now()) {
    sessions.delete(token);
    return res.status(401).json({ error: "Please log in again" });
  }
  next();
};

app.post("/api/admin/logout", requireAdmin, (req, res) => {
  sessions.delete((req.headers.authorization || "").replace("Bearer ", ""));
  res.json({ ok: true });
});

const listRoute = (table) => async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM ${table} ORDER BY id ASC`,
    );
    res.json(rows);
  } catch (e) {
    handleError(res, e);
  }
};

app.get("/api/admin/registrations", requireAdmin, listRoute("registrations"));
app.get("/api/admin/volunteers", requireAdmin, listRoute("volunteers"));
app.get("/api/admin/centres", requireAdmin, listRoute("centres"));

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true, database: "connected" });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
