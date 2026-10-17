const items = [
  {
    icon: "fa-solid fa-graduation-cap",
    title: "AI Career Pathways",
    text: "Jobs, skills and future opportunities",
  },
  {
    icon: "fa-solid fa-gear",
    title: "Emerging Technologies",
    text: "Robotics, drones, generative AI & more",
  },
  {
    icon: "fa-regular fa-file-lines",
    title: "Case Studies",
    text: "Real-world AI applications",
  },
  {
    icon: "fa-solid fa-book",
    title: "Learning Resources",
    text: "Courses, tools and certifications",
  },
];

export default function KnowledgeHub() {
  return (
    <section className="hub" id="hub">
      <div className="container">
        <div className="hub-head">
          <div className="sec-head" style={{ margin: "0 0 16px" }}>
            <div className="ic">
              <i className="fa-solid fa-book-open"></i>
            </div>
            <div>
              <h2>AI Knowledge Hub</h2>
              <p>
                Explore resources on AI technologies, career opportunities,
                learning pathways and success stories.
              </p>
            </div>
          </div>
          <a href="#" className="btn btn-outline btn-sm">
            Explore Knowledge Hub →
          </a>
        </div>
        <div className="hub-grid">
          {items.map((it) => (
            <a href="#" key={it.title}>
              <i className={it.icon}></i>
              <span>
                <b>{it.title}</b>
                <small>{it.text}</small>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
