// Shared helpers for the Vercel serverless functions (files starting with "_" are not routes)
import pg from "pg";
import crypto from "node:crypto";

// ---------- database ----------
const url = process.env.DATABASE_URL || "";
const isLocal = /@(localhost|127\.0\.0\.1)/.test(url);

// reuse one pool between invocations of the same warm function
export const pool =
  globalThis.__pgPool ||
  (globalThis.__pgPool = new pg.Pool({
    connectionString: url,
    max: 3,
    ssl: isLocal ? false : { rejectUnauthorized: false },
  }));

const SCHEMA = `
CREATE TABLE IF NOT EXISTS registrations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  contact VARCHAR(15) NOT NULL,
  is_ncc BOOLEAN DEFAULT FALSE,
  enrollment_no VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS volunteers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  contact VARCHAR(15) NOT NULL,
  is_ncc BOOLEAN DEFAULT FALSE,
  enrollment_no VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS centres (
  id SERIAL PRIMARY KEY,
  centre_name VARCHAR(150) NOT NULL,
  contact VARCHAR(15) NOT NULL,
  district VARCHAR(100) NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  created_at TIMESTAMP DEFAULT NOW()
);`;

// create the tables the first time (cached for the life of the function)
export function ready() {
  if (!globalThis.__schemaReady) {
    globalThis.__schemaReady = pool.query(SCHEMA).catch((e) => {
      globalThis.__schemaReady = null;
      throw e;
    });
  }
  return globalThis.__schemaReady;
}

// ---------- validation ----------
export const clean = (v) => (typeof v === "string" ? v.trim() : "");
export const isEmail = (v) => /^\S+@\S+\.\S+$/.test(v || "");
// Indian mobile number: exactly 10 digits, starting with 6-9
export const isPhone = (v) => /^[6-9]\d{9}$/.test(v || "");

// ---------- responses ----------
export function methodOnly(req, res, method) {
  if (req.method !== method) {
    res.setHeader("Allow", method);
    res.status(405).json({ error: "Method not allowed" });
    return false;
  }
  return true;
}

export function dbError(res, e) {
  if (e.code === "23505")
    return res.status(409).json({ error: "This email is already registered" });
  console.error(e);
  return res
    .status(500)
    .json({ error: "Server error, please try again" });
}

// ---------- admin token (stateless, so it works across serverless calls) ----------
const SESSION_MS = 8 * 60 * 60 * 1000; // 8 hours
const secret = () =>
  process.env.ADMIN_TOKEN_SECRET || process.env.ADMIN_PASSWORD || "";

const b64 = (s) => Buffer.from(s).toString("base64url");
const sign = (payload) =>
  crypto.createHmac("sha256", secret()).update(payload).digest("base64url");

export const safeEqual = (a, b) => {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};

export function makeToken() {
  const payload = b64(JSON.stringify({ exp: Date.now() + SESSION_MS }));
  return payload + "." + sign(payload);
}

export function requireAdmin(req, res) {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  const [payload, sig] = token.split(".");
  let ok = false;
  if (payload && sig && secret() && safeEqual(sig, sign(payload))) {
    try {
      ok = JSON.parse(Buffer.from(payload, "base64url").toString()).exp > Date.now();
    } catch {
      ok = false;
    }
  }
  if (!ok) res.status(401).json({ error: "Please log in again" });
  return ok;
}
