const leaders = [
  {
    img: "/img/open-ai.png",
    alt: "OpenAI",
    lines: ["Generative AI", "and Foundation Models"],
  },
  {
    img: "/img/google.png",
    alt: "Google DeepMind",
    lines: ["Advanced AI Research", "and Real-world AI Systems"],
  },
  {
    img: "/img/Microsoft.png",
    alt: "Microsoft",
    lines: ["AI Platforms and", "Enterprise Solutions"],
  },
  {
    img: "/img/nvidia.png",
    alt: "NVIDIA",
    lines: ["AI Computing", "and Robotics"],
  },
  {
    img: "/img/meta.png",
    alt: "Meta",
    lines: ["AI for Human Connection", "and Open Innovation"],
  },
  {
    img: "/img/amazon.png",
    alt: "Amazon",
    lines: ["AI and Cloud Services", "for a Better Tomorrow"],
  },
];

export default function GlobalLeaders() {
  return (
    <section
      className="dark"
      id="centres"
      style={{ paddingTop: 10, borderTop: "1px solid #1d3f8a" }}>
      <div className="container">
        <div className="workshop-top" style={{ marginBottom: 16 }}>
          <div className="sec-head" style={{ margin: 0 }}>
            <div className="ic globe">
              <i className="fa-solid fa-globe"></i>
            </div>
            <div>
              <h2>Global AI Leaders</h2>
              <p>Leading companies shaping the future of AI</p>
            </div>
          </div>
          <a href="#" className="btn-ghost">
            Explore All Companies →
          </a>
        </div>
        <div className="leaders">
          {leaders.map((l) => (
            <div className="leader glass" key={l.alt}>
              <img src={l.img} alt={l.alt} />
              <p>
                {l.lines[0]}
                <br />
                {l.lines[1]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
