import { useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from './context/LanguageContext.jsx';
import LoadingBlinds from './components/LoadingBlinds.jsx';
import Marquee from './components/Marquee.jsx';
import Hero from './components/Hero.jsx';
import Nav from './components/Nav.jsx';
import BrandNameTransition from './components/BrandNameTransition.jsx';
import DigitalWorks from './components/DigitalWorks.jsx';
import GraphicSleeve from './components/GraphicSleeve.jsx';
import BrandSection from './components/BrandSection.jsx';
import ResumeWireframe from './components/ResumeWireframe.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const { htmlLang } = useLanguage();
  const heroRef = useRef(null);
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    const images = Array.from(document.images);
    images.forEach((img) => {
      if (!img.complete) img.addEventListener('load', refresh);
    });
    return () => {
      window.removeEventListener('load', refresh);
      images.forEach((img) => img.removeEventListener('load', refresh));
    };
  }, []);

  return (
    <div lang={htmlLang}>
      <LoadingBlinds onDone={() => setIntroDone(true)} />
      <Marquee heroRef={heroRef} />
      <Hero ref={heroRef} started={introDone} />
      <Nav heroRef={heroRef} />
      <BrandNameTransition />

      <DigitalWorks />

      <GraphicSleeve />

      <BrandSection />

      <ResumeWireframe />
      <Footer />
    </div>
  );
}
