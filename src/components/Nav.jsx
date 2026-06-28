import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import '../styles/components/Nav.css';

export default function Nav({ heroRef }) {
  const { lang, toggleLang } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const heroEl = heroRef?.current;
    if (!heroEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(heroEl);
    return () => observer.disconnect();
  }, [heroRef]);

  return (
    <nav className={`nav ${visible ? 'nav--visible' : ''}`}>
      <div className="nav__inner container">
        <a href="#digital-works" className="nav__link">
          WORKS
        </a>
        <span className="nav__brand">DORIS KAO</span>
        <div className="nav__right">
          <a href="#about" className="nav__link">
            ABOUT
          </a>
          <button className="nav__toggle" onClick={toggleLang}>
            {lang === 'en' ? 'TC' : 'EN'}
          </button>
        </div>
      </div>
    </nav>
  );
}
