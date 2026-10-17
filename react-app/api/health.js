import { pool, ready, dbUrl } from "./_lib.js";

export default async function handler(_req, res) {
  const url = dbUrl;
  try {
    await ready();
    await pool.query("SELECT 1");
    res.json({ ok: true, database: "connected" });
  } catch (e) {
    console.error(e);
    // safe hints only: no password, host or connection string is ever returned
    let hint = "Check the database link in Vercel and redeploy.";
    if (!url)
      hint =
        "No database link found. Add DATABASE_URL in Vercel (or connect Neon under Storage), then redeploy.";
    else if (/^\s*(psql|['"])/.test(url))
      hint = "The database link must be only the link: remove 'psql' and the quotes.";
    else if (!/^postgres(ql)?:\/\//.test(url))
      hint = "The database link must start with postgresql://";
    else if (e.code === "28P01") hint = "Wrong database password in the link.";
    else if (e.code === "ENOTFOUND") hint = "Database host name is wrong in the link.";
    else if (e.code === "ECONNREFUSED") hint = "Cannot connect: check the link.";
    res.status(500).json({
      ok: false,
      error: "Database not reachable",
      envSet: Boolean(url),
      code: e.code || null,
      hint,
      // names only (never values) of database-related variables Vercel gave this function
      foundVars: Object.keys(process.env).filter((k) =>
        /^(DATABASE|POSTGRES|PG|NEON|ADMIN_PASSWORD)/.test(k),
      ),
      adminPasswordSet: Boolean(process.env.ADMIN_PASSWORD),
    });
  }
}
