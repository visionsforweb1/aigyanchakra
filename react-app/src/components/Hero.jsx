export default function Hero({ onRegister }) {
  return (
    <section className="hero" id="home">
      <div className="container">
        <div className="hero-content">
          <div className="kicker">NCC MAHARASHTRA DIRECTORATE</div>
          <div className="presents">
            <i></i>
            <span>PRESENTS</span>
            <i></i>
          </div>
          <h1>
            <span className="ai">AI</span>
            <span className="gyan">
              GYAN <b>CHAKRA</b>
            </span>
          </h1>
          <h2>EK YUVA MAHASANGAM</h2>
          <div className="hero-line"></div>
          <div className="tag">
            SKILLING MAHARASHTRA'S YOUTH INTO
            <br />
            TOMORROW'S LEADERS OF EMERGING TECHNOLOGY
          </div>
          <div className="hero-pill">
            <span>
              <i className="fa-solid fa-users"></i> ONE LAKH YOUTH
            </span>
            <span>
              <i className="fa-solid fa-book-open"></i> ONE LEARNING MOVEMENT
            </span>
            <span>
              <i className="fa-solid fa-bullseye"></i> VIKSIT BHARAT 2047
            </span>
          </div>
          <div className="hero-icons">
            <span>
              <i className="fa-regular fa-lightbulb"></i> Awareness
            </span>
            <span>
              <i className="fa-solid fa-gear"></i> Skills
            </span>
            <span>
              <i className="fa-solid fa-users"></i> Innovation
            </span>
            <span>
              <i className="fa-solid fa-chart-simple"></i> Opportunities
            </span>
          </div>
          <div className="hero-btns">
            <a
              href="#register"
              className="btn btn-primary"
              onClick={(e) => {
                e.preventDefault();
                onRegister();
              }}>
              Register Now →
            </a>
            <a href="#about" className="btn btn-outline">
              Know More ↓
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
