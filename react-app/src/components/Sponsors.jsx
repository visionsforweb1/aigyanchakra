import { useEffect, useRef } from "react";

const logos = [
  { src: "/img/tata-logo.png", alt: "TATA" },
  { src: "/img/infosys-logo.png", alt: "Infosys" },
  { src: "/img/accenture-logo.png", alt: "accenture" },
  { src: "/img/microsoft-logo.png", alt: "Microsoft" },
  { src: "/img/google-logo.png", alt: "Google" },
  { src: "/img/nvidia-logo.png", alt: "NVIDIA" },
  { src: "/img/aws-logo.png", alt: "aws" },
  { src: "/img/ibm-logo.png", alt: "IBM" },
  { src: "/img/Intel%20Blue%20Orbital%20Logo.png", alt: "intel" },
  { src: "/img/adobe-logo.png", alt: "Adobe" },
];

const STEP = 128; // item width (118) + gap (10)
const LOOP_W = logos.length * STEP;
const SPEED = 0.5;

export default function Sponsors() {
  const slideRef = useRef(null);
  const posRef = useRef(0);
  const pausedRef = useRef(false);

  // infinite auto-scrolling carousel
  useEffect(() => {
    let raf;
    const tick = () => {
      if (!pausedRef.current) posRef.current += SPEED;
      if (posRef.current >= LOOP_W) posRef.current -= LOOP_W;
      if (posRef.current < 0) posRef.current += LOOP_W;
      if (slideRef.current) {
        slideRef.current.style.transform = `translateX(${-posRef.current}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const jump = (dir) => {
    const target = posRef.current + dir * STEP * 2;
    let n = 0;
    const anim = () => {
      posRef.current += (target - posRef.current) * 0.15;
      if (Math.abs(target - posRef.current) > 0.5 && n++ < 60) {
        requestAnimationFrame(anim);
      }
    };
    anim();
  };

  // 3 copies so the strip always fills the viewport while looping
  const loop = [...logos, ...logos, ...logos];

  return (
    <section className="sponsors" id="sponsors">
      <div className="container">
        <div className="sec-head">
          <div className="ic">
            <i className="fa-solid fa-handshake"></i>
          </div>
          <div>
            <h2>Sponsors &amp; Supporters</h2>
            <p>Our valued partners in building an AI-ready future for India.</p>
          </div>
        </div>
        <div className="logos">
          <button
            className="arrow"
            aria-label="Previous"
            onClick={() => jump(-1)}>
            ‹
          </button>
          <div
            className="track"
            onMouseEnter={() => (pausedRef.current = true)}
            onMouseLeave={() => (pausedRef.current = false)}>
            <div className="slide" ref={slideRef}>
              {loop.map((l, i) => (
                <div key={i}>
                  <img src={l.src} alt={l.alt} />
                </div>
              ))}
            </div>
          </div>
          <button className="arrow" aria-label="Next" onClick={() => jump(1)}>
            ›
          </button>
        </div>
        <div className="dots" style={{ marginTop: 14 }}>
          <b>●</b> ● ● ● ● ●
        </div>
      </div>
    </section>
  );
}
