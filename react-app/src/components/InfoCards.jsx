import { useEffect, useState } from "react";

const speakers = [
  {
    img: "/img/img1.png",
    name: "Dr. Ramesh Iyer",
    role: "AI Researcher",
    topic: "Global AI Trends",
  },
  {
    img: "/img/img2.png",
    name: "Ms. Anika Sharma",
    role: "Technology Leader",
    topic: "AI Applications",
  },
  {
    img: "/img/img3.png",
    name: "Prof. Vivek Menon",
    role: "Academic Expert",
    topic: "AI for Youth",
  },
];

const attendees = [
  {
    img: "/img/img4.png",
    name: "Hon'ble Prime Minister of India",
    note: "Special Message on India's Vision for AI",
    message:
      "India will develop AI for the good of humanity and empower our youth during Amrit Kaal.",
  },
  {
    img: "/img/img5.png",
    name: "Hon'ble Chief Minister Maharashtra",
    note: "Vision for AI-driven Maharashtra",
    message:
      "Maharashtra will lead India's AI transformation through innovation, industry collaboration and youth empowerment.",
  },
];

export default function InfoCards({ onRegister }) {
  const [person, setPerson] = useState(null);

  useEffect(() => {
    if (!person) return;
    const onKey = (e) => e.key === "Escape" && setPerson(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [person]);

  return (
    <div className="container">
      <div className="info-row">
        <div className="card" id="about">
          <h3>
            <span className="ic">
              <i className="fa-solid fa-book-open"></i>
            </span>{" "}
            About the Conclave
          </h3>
          <p>
            AI GYAN CHAKRA 2026 is a six-hour workshop organised by NCC Maharashtra
            Directorate to create awareness about Artificial Intelligence and
            the wide range of opportunities it offers for young India.
          </p>
          <a href="#workshop" className="btn btn-primary btn-sm">
            Know More →
          </a>
        </div>

        <div className="card" id="register">
          <h3>
            <span className="ic">
              <i className="fa-solid fa-users"></i>
            </span>{" "}
            Registration
          </h3>
          <p>
            Register now to be part of AI GYAN CHAKRA 2026 and explore the world of AI,
            innovation and future opportunities.
          </p>
          <a
            href="#"
            className="btn btn-primary block"
            onClick={(e) => {
              e.preventDefault();
              onRegister();
            }}>
            Register Now →
          </a>
          <ul>
            <li>
              <i className="fa-solid fa-user"></i> Open for NCC Cadets
            </li>
            <li>
              <i className="fa-solid fa-calendar-days"></i> Limited Seats
            </li>
            <li>
              <i className="fa-solid fa-square-check"></i> Participation
              Certificate
            </li>
          </ul>
        </div>

        <div className="card" id="speakers">
          <h3>
            <span className="ic circle">
              <i className="fa-solid fa-microphone"></i>
            </span>{" "}
            Eminent Speakers
          </h3>
          <div className="sub">Industry Leaders | AI Experts | Academicians</div>
          <div className="spk-wrap">
            <button className="spk-arrow l" aria-label="Previous">
              ‹
            </button>
            <button className="spk-arrow r" aria-label="Next">
              ›
            </button>
            <div className="speakers">
              {speakers.map((s) => (
                <div key={s.name}>
                  <img
                    src={s.img}
                    alt={s.name}
                    className="att-img"
                    title="Click to view"
                    onClick={() =>
                      setPerson({
                        img: s.img,
                        name: s.name,
                        note: s.role,
                        message: `${s.name} will share insights on ${s.topic} with NCC cadets at AI GYAN CHAKRA.`,
                      })
                    }
                  />
                  <b>{s.name}</b>
                  <small>
                    {s.role}
                    <br />
                    {s.topic}
                  </small>
                </div>
              ))}
            </div>
          </div>
          <div className="dots">
            <b>●</b> ● ● ●
          </div>
          <a
            href="#"
            className="btn btn-outline btn-sm block"
            style={{ marginTop: "auto" }}>
            View All Speakers →
          </a>
        </div>

        <div className="card">
          <h3>
            <span className="ic circle">
              <i className="fa-regular fa-star"></i>
            </span>{" "}
            Special Attendees
          </h3>
          <div className="sub">Distinguished Guests &amp; Dignitaries</div>
          <div className="attendees">
            {attendees.map((a) => (
              <div key={a.name}>
                <img
                  src={a.img}
                  alt={a.name}
                  className="att-img"
                  onClick={() => setPerson(a)}
                  title="Click to view"
                />
                <b>{a.name}</b>
                <small>{a.note}</small>
              </div>
            ))}
          </div>
        </div>
      </div>

      {person && (
        <div className="pop-overlay" onMouseDown={() => setPerson(null)}>
          <div
            className="pop"
            role="dialog"
            aria-modal="true"
            aria-label={person.name}
            onMouseDown={(e) => e.stopPropagation()}>
            <button
              className="rf-close"
              onClick={() => setPerson(null)}
              aria-label="Close">
              ×
            </button>
            <img src={person.img} alt={person.name} />
            <div className="pop-body">
              <h3>{person.name}</h3>
              <span className="pop-tag">{person.note}</span>
              <blockquote>
                <i className="fa-solid fa-quote-left"></i> {person.message}
              </blockquote>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
