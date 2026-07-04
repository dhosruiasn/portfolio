import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import '../styles/components/Marquee.css';

export default function Marquee({ heroRef }) {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const heroEl = heroRef?.current;
    if (!heroEl) return;

    let rafId = 0;
    const sync = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setVisible(heroEl.getBoundingClientRect().bottom > 1);
      });
    };
    sync();
    const delayedSyncs = [80, 300, 800].map((delay) => window.setTimeout(sync, delay));
    window.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('hashchange', sync);
    window.addEventListener('load', sync);
    window.addEventListener('resize', sync);
    window.addEventListener('orientationchange', sync);
    return () => {
      cancelAnimationFrame(rafId);
      delayedSyncs.forEach((id) => window.clearTimeout(id));
      window.removeEventListener('scroll', sync);
      window.removeEventListener('hashchange', sync);
      window.removeEventListener('load', sync);
      window.removeEventListener('resize', sync);
      window.removeEventListener('orientationchange', sync);
    };
  }, [heroRef]);

  const text = `${t.marquee}    `;

  return (
    <div className={`marquee ${visible ? '' : 'marquee--hidden'}`}>
      <div className="marquee__track">
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="marquee__item">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
