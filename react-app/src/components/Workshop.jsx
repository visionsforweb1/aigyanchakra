import { useState } from "react";
import PersonPopup from "./PersonPopup.jsx";

const steps = [
  {
    icon: <img src="/img/cyber-%20brain%20.png" alt="AI Fundamentals" />,
    title: "1. AI Fundamentals",
    text: "Understanding AI, its applications and real-world impact.",
  },
  {
    cls: "fa-solid fa-gear",
    color: "#1fd1c5",
    title: "2. Hands-on Sessions",
    text: "Live demonstrations and practical exposure to AI tools.",
  },
  {
    cls: "fa-solid fa-chart-simple",
    color: "#3fa9ff",
    title: "3. Opportunities in AI",
    text: "Careers, higher education and entrepreneurship pathways.",
  },
  {
    cls: "fa-solid fa-lightbulb",
    color: "#ffd54a",
    title: "4. Industry Insights",
    text: "Learn from experts and industry leaders.",
  },
  {
    cls: "fa-solid fa-bullseye",
    color: "#ff6a3d",
    title: "5. Innovation & Ideas",
    text: "Case studies and problem-solving for real-world challenges.",
  },
  {
    cls: "fa-solid fa-users",
    color: "#9b7bff",
    title: "6. Youth Leadership",
    text: "Role of NCC cadets in building an AI-ready India.",
  },
];

// Pop-up shown by "Read Full Message" (desktop only). Replace `message` with the full text.
const PM_MESSAGE = {
  img: "/img/img4.png",
  name: "Hon'ble Prime Minister's AI Vision",
  note: "Message from the Hon'ble Prime Minister of India",
  message:
    "India will develop AI for the good of humanity and empower our youth during Amrit Kaal.",
};

export default function Workshop() {
  const [person, setPerson] = useState(null);

  return (
    <section className="dark" id="workshop">
      <div className="container">
        <div className="workshop-top">
          <div className="sec-head" style={{ margin: 0 }}>
            <div className="ic clock">
              <img src="/img/clock.png" alt="Clock" />
            </div>
            <div>
              <h2>Six-Hour AI Workshop</h2>
              <p>
                A comprehensive workshop covering awareness, hands-on learning
                and real-world opportunities in AI.
              </p>
            </div>
          </div>
          <div className="chips glass">
            <span>📅 One Day Event</span>
            <span>🕒 6 Hours</span>
            <span>👥 For NCC Cadets</span>
            <span>📜 Participation Certificate</span>
          </div>
        </div>

        <div className="six">
          {steps.map((s) => (
            <div className="glass" key={s.title}>
              {s.icon ? (
                <i>{s.icon}</i>
              ) : (
                <i className={s.cls} style={{ color: s.color }}></i>
              )}
              <span>
                <b>{s.title}</b>
                {s.text}
              </span>
            </div>
          ))}
        </div>

        <div className="visions">
          <div className="vision pm" id="national">
            <div className="body">
              <h3>Hon'ble Prime Minister's AI Vision</h3>
              <blockquote className="glass-light">
                <q>
                  India will develop AI for the good of humanity and empower our
                  youth during Amrit Kaal.
                </q>
                <small>— Hon'ble Prime Minister of India</small>
              </blockquote>
              <a
                href="#"
                className="btn btn-orange btn-sm"
                onClick={(e) => {
                  // the pop-up is for desktop only; on phones/tablets the button does nothing
                  e.preventDefault();
                  if (window.matchMedia("(min-width: 769px)").matches)
                    setPerson(PM_MESSAGE);
                }}>
                Read Full Message →
              </a>
            </div>
          </div>
          <div className="vision cm" id="maha">
            <div className="body">
              <h3>Maharashtra's AI Vision</h3>
              <blockquote className="glass-light">
                <q>
                  Maharashtra will lead India's AI transformation through
                  innovation, industry collaboration and youth empowerment.
                </q>
                <small>— Hon'ble Chief Minister, Maharashtra</small>
              </blockquote>
              <a href="#" className="btn btn-primary btn-sm">
                Know More →
              </a>
            </div>
          </div>
        </div>
      </div>

      <PersonPopup person={person} onClose={() => setPerson(null)} />
    </section>
  );
}
