export default function Header({ onRegister }) {
  return (
    <header>
      <div className="container nav">
        <a href="#home" className="brand">
          <img src="/img/ncc-logo.png" alt="NCC Logo" />
          <div>
            <b>NCC Maharashtra Directorate</b>
            <small>AI GYAN CHAKRA – Ek Yuva Mahasangam</small>
          </div>
        </a>
        <a
          href="#register"
          className="reg"
          onClick={(e) => {
            e.preventDefault();
            onRegister();
          }}>
          <i className="fa-solid fa-user"></i> Register Now
        </a>
      </div>
    </header>
  );
}
