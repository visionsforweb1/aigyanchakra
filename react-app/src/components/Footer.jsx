const links = [
  ["#home", "Home"],
  ["#hub", "AI Knowledge Hub"],
  ["#contact", "Contact"],
  ["#about", "About the Conclave"],
  ["#centres", "Participating Centres"],
  ["#", "Gallery"],
  ["#national", "National AI Vision"],
  ["#speakers", "Speakers"],
  ["#", "FAQs"],
  ["#maha", "Maharashtra AI Vision"],
  ["#sponsors", "Sponsors & Supporters"],
  ["#", "Privacy Policy"],
];

const socials = [
  ["YouTube", "fa-brands fa-youtube"],
  ["Instagram", "fa-brands fa-instagram"],
  ["LinkedIn", "fa-brands fa-linkedin-in"],
  ["X", "fa-brands fa-x-twitter"],
];

export default function Footer() {
  return (
    <footer id="contact">
      <div className="container foot">
        <div className="foot-brand">
          <img src="/img/footer.png" alt="NCC" />
        </div>
        <div>
          <h4>Quick Links</h4>
          <div className="qlinks">
            {links.map(([href, label]) => (
              <a href={href} key={label}>
                {label}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4>Connect With Us</h4>
          <p>
            <i className="fa-solid fa-location-dot"></i>
            <span>
              NCC Maharashtra Directorate
              <br />
              Pune, Maharashtra, India
            </span>
          </p>
          <p>
            <i className="fa-solid fa-envelope"></i> info@nccmaharashtra.gov.in
          </p>
          <div className="social">
            {socials.map(([label, icon]) => (
              <a href="#" aria-label={label} key={label}>
                <i className={icon}></i>
              </a>
            ))}
          </div>
        </div>
        <div className="right">
          <img src="/img/footer-cadets.png" alt="" />
          <span style={{ position: "relative", zIndex: 1 }}>
            DISCIPLINE
            <br />
            LEADERSHIP
            <br />
            TECHNOLOGY
            <br />A BRIGHTER INDIA
          </span>
        </div>
      </div>
    </footer>
  );
}
