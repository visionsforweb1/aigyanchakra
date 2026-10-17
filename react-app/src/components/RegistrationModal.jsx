import { useEffect, useState } from "react";

const TABS = [
  { id: "normal", label: "Registration", icon: "fa-solid fa-user" },
  { id: "center", label: "Centre Registration", icon: "fa-solid fa-building" },
  { id: "volunteer", label: "Volunteer", icon: "fa-solid fa-hand-holding-heart" },
];

const emptyForm = {
  name: "",
  email: "",
  contact: "",
  isNcc: "no",
  enrollment: "",
  centreName: "",
  district: "",
  capacity: "",
};

export default function RegistrationModal({ open, initialTab, onClose }) {
  const [tab, setTab] = useState(initialTab || "normal");
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (open) {
      setTab(initialTab || "normal");
      setForm(emptyForm);
      setErrors({});
      setDone(false);
    }
  }, [open, initialTab]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const set = (k) => (e) => {
    let v = e.target.value;
    // contact: digits only, max 10
    if (k === "contact") v = v.replace(/\D/g, "").slice(0, 10);
    setForm({ ...form, [k]: v });
    setErrors({ ...errors, [k]: undefined });
  };

  const switchTab = (id) => {
    setTab(id);
    setErrors({});
    setDone(false);
  };

  const validate = () => {
    const e = {};
    const needsPerson = tab === "normal" || tab === "volunteer";
    if (needsPerson) {
      if (!form.name.trim()) e.name = "Please enter your name";
      if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
      if (form.isNcc === "yes" && !form.enrollment.trim())
        e.enrollment = "Enter your NCC enrollment number";
    } else {
      if (!form.centreName.trim()) e.centreName = "Enter the centre name";
      if (!form.district.trim()) e.district = "Enter the district";
      if (!form.capacity || Number(form.capacity) < 1)
        e.capacity = "Enter the auditorium capacity";
    }
    if (!/^[6-9]\d{9}$/.test(form.contact))
      e.contact = "Enter a valid 10-digit Indian mobile number (starts with 6-9)";
    return e;
  };

  const ENDPOINTS = {
    normal: "/api/register",
    volunteer: "/api/volunteer",
    center: "/api/centre",
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setSending(true);
    try {
      const res = await fetch(ENDPOINTS[tab], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setDone(true);
      } else {
        setErrors({ form: data.error || "Something went wrong" });
      }
    } catch {
      setErrors({ form: "Cannot reach the server. Please try again." });
    } finally {
      setSending(false);
    }
  };

  const field = (key, label, props = {}) => (
    <div className={"rf-field" + (errors[key] ? " has-error" : "")}>
      <label htmlFor={"rf-" + key}>{label}</label>
      <input
        id={"rf-" + key}
        value={form[key]}
        onChange={set(key)}
        {...(key === "contact"
          ? { inputMode: "numeric", maxLength: 10, autoComplete: "tel-national" }
          : {})}
        {...props}
      />
      {errors[key] && <span className="rf-err">{errors[key]}</span>}
    </div>
  );

  const nccFields = (
    <>
      <div className="rf-field">
        <label>Are you an NCC cadet?</label>
        <div className="rf-radio">
          {["yes", "no"].map((v) => (
            <label key={v}>
              <input
                type="radio"
                name="isNcc"
                value={v}
                checked={form.isNcc === v}
                onChange={set("isNcc")}
              />
              {v === "yes" ? "Yes" : "No"}
            </label>
          ))}
        </div>
      </div>
      {form.isNcc === "yes" &&
        field("enrollment", "NCC Enrollment Number", {
          placeholder: "e.g. MH20SDA123456",
        })}
    </>
  );

  return (
    <div className="rf-overlay" onMouseDown={onClose}>
      <div
        className="rf-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Registration"
        onMouseDown={(e) => e.stopPropagation()}>
        <button className="rf-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <div className="rf-head">
          <h2>Register for AI GYAN CHAKRA</h2>
          <p>Ek Yuva Mahasangam – NCC Maharashtra Directorate</p>
        </div>

        <div className="rf-tabs" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              className={tab === t.id ? "active" : ""}
              onClick={() => switchTab(t.id)}
              type="button">
              <i className={t.icon}></i> {t.label}
            </button>
          ))}
        </div>

        {done ? (
          <div className="rf-done">
            <i className="fa-solid fa-circle-check"></i>
            <h3>Thank you!</h3>
            <p>
              {tab === "center"
                ? "Your centre has been registered."
                : tab === "volunteer"
                  ? "Thanks for volunteering. We will contact you soon."
                  : "You have been registered successfully."}
            </p>
            <button className="btn btn-primary" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            {tab === "center" ? (
              <>
                {field("centreName", "Centre / Institution Name")}
                {field("contact", "Contact Number", {
                  type: "tel",
                  placeholder: "10-digit mobile number",
                })}
                {field("district", "District")}
                {field("capacity", "Auditorium Capacity", {
                  type: "number",
                  min: 1,
                  placeholder: "Number of seats",
                })}
              </>
            ) : (
              <>
                {field("name", "Full Name")}
                {field("email", "Email ID", { type: "email" })}
                {field("contact", "Contact Number", {
                  type: "tel",
                  placeholder: "10-digit mobile number",
                })}
                {nccFields}
              </>
            )}
            {errors.form && <div className="rf-formerr">{errors.form}</div>}
            <button
              type="submit"
              className="btn btn-primary rf-submit"
              disabled={sending}>
              {sending
                ? "Submitting..."
                : (tab === "center"
                    ? "Register Centre"
                    : tab === "volunteer"
                      ? "Register as Volunteer"
                      : "Register Now") + " →"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
