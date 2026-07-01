import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import '../styles/components/Nav.css';

export default function Nav({ heroRef }) {
  const { lang, setLang } = useLanguage();
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
          <div className="nav__language" aria-label="Language selection">
            <button
              className={`nav__language-option${lang === 'en' ? ' nav__language-option--active' : ''}`}
              type="button"
              aria-pressed={lang === 'en'}
              aria-current={lang === 'en' ? 'true' : undefined}
              onClick={() => setLang('en')}
            >
              EN
            </button>
            <span aria-hidden="true">/</span>
            <button
              className={`nav__language-option${lang === 'zh' ? ' nav__language-option--active' : ''}`}
              type="button"
              aria-pressed={lang === 'zh'}
              aria-current={lang === 'zh' ? 'true' : undefined}
              onClick={() => setLang('zh')}
            >
              中
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
