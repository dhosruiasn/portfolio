import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import '../styles/components/Marquee.css';

export default function Marquee({ heroRef }) {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const heroEl = heroRef?.current;
    if (!heroEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(heroEl);
    return () => observer.disconnect();
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
