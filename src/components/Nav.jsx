import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import '../styles/components/Nav.css';

// 手機版選單錨點（原生錨點：本頁程式化 smooth scroll 會被 ScrollTrigger pin 卡住）
const MENU_ITEMS = [
  { href: '#digital-works', label: 'DIGITAL WORKS' },
  { href: '#graphic-works', label: 'GRAPHIC WORK' },
  { href: '#about', label: 'ABOUT / CV' },
  { href: '#contact', label: 'CONTACT' },
];

export default function Nav({ heroRef }) {
  const { lang, setLang } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const heroEl = heroRef?.current;
    if (!heroEl) return;

    let rafId = 0;
    const sync = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setVisible(heroEl.getBoundingClientRect().bottom <= 1);
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

  // nav 隱藏（回到 hero）時順便收合選單
  useEffect(() => {
    if (!visible) setMenuOpen(false);
  }, [visible]);

  // 點選單以外的區域就收合（手機慣例）
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onOutside = (event) => {
      if (!event.target.closest('.nav')) setMenuOpen(false);
    };
    document.addEventListener('pointerdown', onOutside);
    return () => document.removeEventListener('pointerdown', onOutside);
  }, [menuOpen]);

  return (
    <nav className={`nav ${visible ? 'nav--visible' : ''}`}>
      <div className="nav__inner container">
        {/* 手機版漢堡（桌面隱藏）；WORKS/ABOUT 文字連結收進選單 */}
        <button
          className="nav__menu-toggle"
          type="button"
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? (
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
              <path d="M5 5l14 14M19 5 5 19" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
              <path d="M3 6h18M3 12h18M3 18h18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          )}
        </button>
        <a href="#digital-works" className="nav__link">
          WORKS
        </a>
        <a href="#hero" className="nav__brand" aria-label="Back to top">
          DORIS KAO
        </a>
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
      {menuOpen && (
        <div className="nav__menu">
          {MENU_ITEMS.map((item) => (
            <a key={item.href} href={item.href} className="nav__menu-link" onClick={() => setMenuOpen(false)}>
              {item.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
