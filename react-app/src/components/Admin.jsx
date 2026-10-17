import { useCallback, useEffect, useMemo, useState } from "react";

const TABS = {
  registrations: {
    label: "Registrations",
    icon: "fa-solid fa-user-check",
    color: "blue",
    columns: [
      ["id", "#"],
      ["name", "Name"],
      ["email", "Email"],
      ["contact", "Contact"],
      ["is_ncc", "NCC Cadet"],
      ["enrollment_no", "Enrollment No."],
      ["created_at", "Registered On"],
    ],
  },
  centres: {
    label: "Centres",
    icon: "fa-solid fa-building-columns",
    color: "orange",
    columns: [
      ["id", "#"],
      ["centre_name", "Centre"],
      ["contact", "Contact"],
      ["district", "District"],
      ["capacity", "Capacity"],
      ["created_at", "Registered On"],
    ],
  },
  volunteers: {
    label: "Volunteers",
    icon: "fa-solid fa-hand-holding-heart",
    color: "green",
    columns: [
      ["id", "#"],
      ["name", "Name"],
      ["email", "Email"],
      ["contact", "Contact"],
      ["is_ncc", "NCC Cadet"],
      ["enrollment_no", "Enrollment No."],
      ["created_at", "Registered On"],
    ],
  },
};

const fmt = (key, v) => {
  if (v === null || v === undefined || v === "") return "—";
  if (key === "is_ncc") return v ? "Yes" : "No";
  if (key === "created_at") return new Date(v).toLocaleString();
  return String(v);
};

const csvCell = (s) => `"${String(s).replace(/"/g, '""')}"`;
const initials = (n = "") =>
  n
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("") || "?";
const sameDay = (a, b) => new Date(a).toDateString() === b.toDateString();

export default function Admin() {
  const [token, setToken] = useState(
    () => sessionStorage.getItem("adminToken") || "",
  );
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loginErr, setLoginErr] = useState("");
  const [data, setData] = useState({});
  const [tab, setTab] = useState("dashboard");
  const isDash = tab === "dashboard";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const logout = useCallback(() => {
    sessionStorage.removeItem("adminToken");
    setToken("");
    setData({});
  }, []);

  const login = async (e) => {
    e.preventDefault();
    setLoginErr("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) return setLoginErr(body.error || "Login failed");
      sessionStorage.setItem("adminToken", body.token);
      setToken(body.token);
      setPassword("");
    } catch {
      setLoginErr("Cannot reach the server");
    }
  };

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const entries = await Promise.all(
        Object.keys(TABS).map(async (k) => {
          const res = await fetch(`/api/admin/${k}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.status === 401) throw new Error("401");
          if (!res.ok) throw new Error("fail");
          return [k, await res.json()];
        }),
      );
      setData(Object.fromEntries(entries));
    } catch (e) {
      if (e.message === "401") logout();
      else setError("Could not load data. Is the server running?");
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  useEffect(() => {
    if (token) loadAll();
  }, [token, loadAll]);

  const stats = useMemo(() => {
    const people = [...(data.registrations || []), ...(data.volunteers || [])];
    const all = [...people, ...(data.centres || [])];
    const ncc = people.filter((p) => p.is_ncc).length;
    const now = new Date();
    const week = [...Array(7)].map((_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (6 - i));
      return {
        label: d.toLocaleDateString(undefined, { weekday: "short" }),
        count: all.filter((r) => sameDay(r.created_at, d)).length,
      };
    });
    return {
      total: all.length,
      today: week[6].count,
      ncc,
      civ: people.length - ncc,
      people: people.length,
      seats: (data.centres || []).reduce((s, c) => s + (c.capacity || 0), 0),
      week,
      max: Math.max(1, ...week.map((w) => w.count)),
    };
  }, [data]);

  const nccPct = stats.people ? Math.round((stats.ncc / stats.people) * 100) : 0;

  if (!token) {
    return (
      <div className="adm-login-wrap">
        <form className="adm-login" onSubmit={login}>
          <div className="adm-login-logo">
            <img src="/img/ncc-logo.png" alt="NCC" />
          </div>
          <h1>Admin Login</h1>
          <p>AI GYAN CHAKRA – NCC Maharashtra Directorate</p>
          <div className="adm-input">
            <i className="fa-solid fa-lock"></i>
            <input
              type={showPw ? "text" : "password"}
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
              autoFocus
            />
            <button
              type="button"
              className="adm-eye"
              onClick={() => setShowPw(!showPw)}
              aria-label="Show or hide password">
              <i className={"fa-solid " + (showPw ? "fa-eye-slash" : "fa-eye")}></i>
            </button>
          </div>
          {loginErr && <div className="rf-formerr">{loginErr}</div>}
          <button className="btn btn-primary" type="submit">
            Login →
          </button>
          <a href="/" className="adm-back">
            ← Back to website
          </a>
        </form>
      </div>
    );
  }

  const kpis = [
    {
      cls: "blue",
      icon: "fa-solid fa-users",
      value: stats.total,
      label: "Total sign-ups",
    },
    {
      cls: "orange",
      icon: "fa-solid fa-bolt",
      value: stats.today,
      label: "Joined today",
    },
    {
      cls: "green",
      icon: "fa-solid fa-medal",
      value: stats.ncc,
      label: "NCC cadets",
    },
  ];

  return (
    <div className="adm">
      <aside className="adm-side">
        <div className="adm-brand">
          <img src="/img/ncc-logo.png" alt="NCC" />
          <div>
            <b>AI GYAN CHAKRA</b>
            <small>Admin Panel</small>
          </div>
        </div>

        <nav className="adm-nav">
          <span className="adm-nav-title">Overview</span>
          <button
            className={isDash ? "active" : ""}
            onClick={() => setTab("dashboard")}>
            <i className="fa-solid fa-gauge-high"></i>
            <span>Dashboard</span>
            <em>{stats.total}</em>
          </button>
          <span className="adm-nav-title adm-nav-gap">Manage</span>
          {Object.entries(TABS).map(([id, t]) => (
            <button
              key={id}
              className={tab === id ? "active" : ""}
              onClick={() => setTab(id)}>
              <i className={t.icon}></i>
              <span>{t.label}</span>
              <em>{data[id] ? data[id].length : "–"}</em>
            </button>
          ))}
        </nav>

        <div className="adm-side-foot">
          <a href="/">
            <i className="fa-solid fa-arrow-up-right-from-square"></i> View
            website
          </a>
          <button onClick={logout}>
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </button>
        </div>
        <div className="adm-tricolor"></div>
      </aside>

      <div className="adm-content">
        <div className="adm-head">
          <div>
            <h1>{isDash ? "Dashboard" : TABS[tab].label}</h1>
            <p>
              {new Date().toLocaleDateString(undefined, {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <button className="adm-btn" onClick={loadAll}>
            <i
              className={"fa-solid fa-rotate" + (loading ? " fa-spin" : "")}></i>{" "}
            Refresh
          </button>
        </div>

        {isDash && (
          <>
        <div className="adm-kpi-row">
          {kpis.map((k) => (
            <div key={k.label} className={"adm-kpi " + k.cls}>
              <span className="adm-kpi-ic">
                <i className={k.icon}></i>
              </span>
              <div>
                <b>{k.value}</b>
                <small>{k.label}</small>
              </div>
            </div>
          ))}
        </div>

        <div className="adm-charts">
          <div className="adm-panel">
            <h3>
              <i className="fa-solid fa-chart-column"></i> Sign-ups – last 7
              days
            </h3>
            <div className="adm-bars">
              {stats.week.map((w, i) => (
                <div className="adm-bar-col" key={i}>
                  <span className="adm-bar-val">{w.count}</span>
                  <div className="adm-bar-wrap">
                    <div
                      className={"adm-bar-item" + (i === 6 ? " today" : "")}
                      style={{
                        height: (w.count / stats.max) * 100 + "%",
                        minHeight: w.count ? 6 : 3,
                      }}
                    />
                  </div>
                  <span className="adm-bar-lbl">{w.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="adm-panel">
            <h3>
              <i className="fa-solid fa-chart-pie"></i> NCC cadets vs civilians
            </h3>
            <div className="adm-donut-row">
              <div
                className="adm-donut"
                style={{
                  background: stats.people
                    ? `conic-gradient(#f58220 0 ${nccPct}%, #dfe7f7 ${nccPct}% 100%)`
                    : "#dfe7f7",
                }}>
                <div>
                  <b>{nccPct}%</b>
                  <small>NCC</small>
                </div>
              </div>
              <ul className="adm-legend">
                <li>
                  <span style={{ background: "#f58220" }} /> NCC cadets
                  <b>{stats.ncc}</b>
                </li>
                <li>
                  <span style={{ background: "#dfe7f7" }} /> Civilians
                  <b>{stats.civ}</b>
                </li>
              </ul>
            </div>
          </div>
        </div>
          </>
        )}

        {error && <div className="rf-formerr">{error}</div>}

        <AllRegistrations
          key={tab}
          data={data}
          loading={loading}
          only={isDash ? undefined : tab}
        />
      </div>
    </div>
  );
}

const FILTERS = [
  ["all", "All", "fa-solid fa-layer-group"],
  ["registrations", "Registrations", "fa-solid fa-user-check"],
  ["volunteers", "Volunteers", "fa-solid fa-hand-holding-heart"],
  ["centres", "Centres", "fa-solid fa-building-columns"],
];

const TYPE = {
  registrations: { label: "Registration", color: "blue" },
  volunteers: { label: "Volunteer", color: "green" },
  centres: { label: "Centre", color: "orange" },
};

// columns of the single combined table
const COLUMNS = [
  ["no", "#"],
  ["type", "Type"],
  ["who", "Name / Centre"],
  ["email", "Email"],
  ["contact", "Contact"],
  ["is_ncc", "NCC Cadet"],
  ["enrollment_no", "Enrollment No."],
  ["district", "District"],
  ["capacity", "Capacity"],
  ["created_at", "Registered On"],
];

// one table that shows every sign-up (registrations + volunteers + centres)
// columns that don't apply to a single-type page
const HIDE = {
  registrations: ["type", "district", "capacity"],
  volunteers: ["type", "district", "capacity"],
  centres: ["type", "email", "is_ncc", "enrollment_no"],
};

// `only` = show just one type (a sidebar page); empty = every sign-up
function AllRegistrations({ data, loading, only }) {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const COLS = only
    ? COLUMNS.filter(([k]) => !HIDE[only].includes(k))
    : COLUMNS;

  // merge the three lists, tag each row with its type, oldest first
  const all = useMemo(() => {
    const merged = Object.keys(TYPE).flatMap((t) =>
      (data[t] || []).map((r) => ({
        ...r,
        type: t,
        who: r.name || r.centre_name,
      })),
    );
    merged.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    const list = only ? merged.filter((r) => r.type === only) : merged;
    return list.map((r, i) => ({ ...r, no: i + 1 }));
  }, [data, only]);

  const counts = useMemo(() => {
    const c = { all: all.length };
    Object.keys(TYPE).forEach((t) => (c[t] = (data[t] || []).length));
    return c;
  }, [all, data]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter((r) => {
      if (filter !== "all" && r.type !== filter) return false;
      if (!q) return true;
      return COLS.some(([k]) => cellText(k, r).toLowerCase().includes(q));
    });
  }, [all, filter, query]);

  const downloadCsv = () => {
    const head = COLS.map(([, l]) => csvCell(l)).join(",");
    const body = rows
      .map((r) => COLS.map(([k]) => csvCell(cellText(k, r))).join(","))
      .join("\n");
    const blob = new Blob(["\uFEFF" + head + "\n" + body], {
      type: "text/csv;charset=utf-8",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${only || "all-registrations"}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="adm-card">
      <div className="adm-bar">
        <h2>
          <i className="fa-solid fa-database"></i>{" "}{only ? TABS[only].label : "All Registrations"}
          <span className="adm-badge">{all.length}</span>
        </h2>
        <div className="adm-search-wrap">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            className="adm-search"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button
          className="adm-btn primary"
          onClick={downloadCsv}
          disabled={!rows.length}>
          <i className="fa-solid fa-download"></i> Download CSV
        </button>
      </div>

      {!only && (
      <div className="adm-filters">
        {FILTERS.map(([id, label, icon]) => (
          <button
            key={id}
            className={filter === id ? "active" : ""}
            onClick={() => setFilter(id)}>
            <i className={icon}></i> {label} <em>{counts[id]}</em>
          </button>
        ))}
      </div>
      )}

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              {COLS.map(([k, l]) => (
                <th key={k}>{l}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.type + r.id}>
                {COLS.map(([k]) => (
                  <td key={k}>{renderAll(k, r)}</td>
                ))}
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={COLS.length} className="adm-empty">
                  <i className="fa-regular fa-folder-open"></i>
                  {loading ? "Loading..." : "No records found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="adm-count">
        Showing {rows.length} of {all.length}
      </div>
    </div>
  );
}

// plain text of a cell (used for search and CSV)
function cellText(key, r) {
  if (key === "type") return TYPE[r.type].label;
  return fmt(key, r[key]);
}

// pretty version of a cell (used in the table)
function renderAll(key, r) {
  const v = r[key];
  if (key === "no") return <span className="adm-num">{v}</span>;
  if (key === "type")
    return (
      <span className={"adm-type " + TYPE[r.type].color}>
        {TYPE[r.type].label}
      </span>
    );
  if (key === "who" && v)
    return (
      <div className="adm-who">
        <span className={"adm-avatar " + TYPE[r.type].color}>
          {initials(v)}
        </span>
        {v}
      </div>
    );
  if (key === "is_ncc" && r.type !== "centres")
    return (
      <span className={"adm-pill " + (v ? "yes" : "no")}>
        {v ? "NCC Cadet" : "Civilian"}
      </span>
    );
  if (key === "capacity" && v)
    return (
      <span className="adm-pill seats">
        <i className="fa-solid fa-chair"></i> {v}
      </span>
    );
  if (key === "is_ncc") return "—";
  return fmt(key, v);
}


