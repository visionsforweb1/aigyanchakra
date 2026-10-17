import { useEffect } from "react";

// Photo + title + message pop-up (used for attendees, speakers and the full messages).
// person = { img, name, note, message }   |   onClose() closes it
export default function PersonPopup({ person, onClose }) {
  useEffect(() => {
    if (!person) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [person, onClose]);

  if (!person) return null;

  return (
    <div className="pop-overlay" onMouseDown={onClose}>
      <div
        className="pop"
        role="dialog"
        aria-modal="true"
        aria-label={person.name}
        onMouseDown={(e) => e.stopPropagation()}>
        <button className="rf-close" onClick={onClose} aria-label="Close">
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
  );
}
