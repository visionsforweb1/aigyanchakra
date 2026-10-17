import { pool, ready } from "./_lib.js";

export default async function handler(_req, res) {
  const url = process.env.DATABASE_URL || "";
  try {
    await ready();
    await pool.query("SELECT 1");
    res.json({ ok: true, database: "connected" });
  } catch (e) {
    console.error(e);
    // safe hints only: no password, host or connection string is ever returned
    let hint = "Check DATABASE_URL in Vercel and redeploy.";
    if (!url) hint = "DATABASE_URL is not set. Add it in Vercel, then redeploy.";
    else if (/^\s*(psql|['"])/.test(url))
      hint = "DATABASE_URL must be only the link: remove 'psql' and the quotes.";
    else if (!/^postgres(ql)?:\/\//.test(url))
      hint = "DATABASE_URL must start with postgresql://";
    else if (e.code === "28P01") hint = "Wrong database password in DATABASE_URL.";
    else if (e.code === "ENOTFOUND") hint = "Database host name is wrong in DATABASE_URL.";
    else if (e.code === "ECONNREFUSED") hint = "Cannot connect: check DATABASE_URL.";
    res.status(500).json({
      ok: false,
      error: "Database not reachable",
      envSet: Boolean(url),
      code: e.code || null,
      hint,
    });
  }
}
