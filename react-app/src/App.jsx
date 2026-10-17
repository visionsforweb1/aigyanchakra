import { useCallback, useState } from "react";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import InfoCards from "./components/InfoCards.jsx";
import Workshop from "./components/Workshop.jsx";
import GlobalLeaders from "./components/GlobalLeaders.jsx";
import KnowledgeHub from "./components/KnowledgeHub.jsx";
import Sponsors from "./components/Sponsors.jsx";
import Footer from "./components/Footer.jsx";
import RegistrationModal from "./components/RegistrationModal.jsx";
import Admin from "./components/Admin.jsx";

export default function App() {
  if (window.location.pathname.startsWith("/admin")) return <Admin />;
  return <Website />;
}

function Website() {
  const [reg, setReg] = useState({ open: false, tab: "normal" });
  const openReg = useCallback(
    (tab = "normal") => setReg({ open: true, tab }),
    [],
  );
  const closeReg = useCallback(() => setReg((r) => ({ ...r, open: false })), []);

  return (
    <>
      <Header onRegister={openReg} />
      <Hero onRegister={openReg} />
      <InfoCards onRegister={openReg} />
      <Workshop />
      <GlobalLeaders />
      <KnowledgeHub />
      <Sponsors />
      <Footer />
      <RegistrationModal
        open={reg.open}
        initialTab={reg.tab}
        onClose={closeReg}
      />
    </>
  );
}
