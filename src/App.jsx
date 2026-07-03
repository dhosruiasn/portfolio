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
    // 自訂字型（Ojuju/Dotrice）晚載入會改變區塊高度，pin 位置要重算
    if (document.fonts?.ready) document.fonts.ready.then(refresh);
    // 直橫轉向後 pin 位置全部失準，需重算（resize 事件在 iOS 轉向時機不可靠）
    const onOrientation = () => setTimeout(refresh, 300);
    window.addEventListener('orientationchange', onOrientation);
    return () => {
      window.removeEventListener('load', refresh);
      window.removeEventListener('orientationchange', onOrientation);
      images.forEach((img) => img.removeEventListener('load', refresh));
    };
  }, []);

  // 圖片載入失敗時給佔位樣式，避免資產 404 變成無提示的白框。
  // 只處理自家資產（同源），不攔第三方圖
  useEffect(() => {
    const onError = (event) => {
      const el = event.target;
      if (!(el instanceof HTMLImageElement)) return;
      if (el.src && !el.src.startsWith(window.location.origin)) return;
      el.classList.add('img-load-failed');
    };
    window.addEventListener('error', onError, true);
    return () => window.removeEventListener('error', onError, true);
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
