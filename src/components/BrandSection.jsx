import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextScramble } from '../utils/TextScramble.js';
import { assetPath } from '../utils/assetPath.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import GraphicOverlay, { COLLAGE_ASSETS } from './GraphicOverlay.jsx';
import BrandEditPanel from './BrandEditPanel.jsx';
import '../styles/components/BrandSection.css';

gsap.registerPlugin(ScrollTrigger);

const BASE = 'images/graphic/brand-section';
const POSTER_BASE = 'images/graphic/poster';
const STARS = [1, 2, 3, 4, 5, 6, 7, 8];
const POSTERS = [
  {
    id: 'mirror',
    src: `${POSTER_BASE}/poster_1.png`,
    alt: 'Mirror poster',
    title: 'Mirror',
    color: '#948d82',
    left: 80,
    top: 0,
    width: 568,
    height: 990,
    settleRotate: -1.2,
    swayRotate: 1.1,
  },
  {
    id: 'story',
    src: `${POSTER_BASE}/poster_2.png`,
    alt: 'Story poster',
    title: 'Story',
    color: '#7a3513',
    left: 676,
    top: 0,
    width: 568,
    height: 990,
    settleRotate: 0.8,
    swayRotate: -0.9,
  },
  {
    id: 'meow-tee',
    src: `${POSTER_BASE}/poster_3.png`,
    alt: 'MEOW TEE poster',
    title: 'MEOW TEE',
    color: '#4aa4ff',
    left: 1272,
    top: 0,
    width: 568,
    height: 990,
    settleRotate: -0.6,
    swayRotate: 0.8,
  },
];
const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
const SHOW_GRID = import.meta.env.DEV && !!params && params.has('grid');
const SHOW_EDIT = import.meta.env.DEV && !!params && params.has('edit');
const SHOW_OVERLAY = import.meta.env.DEV && !!params && params.has('overlay'); // dev：直接開門後拼貼頁預覽
const DOOR_HINGE = '43.67% 74.05%';

// 可調位置的預設值（編輯面板會即時覆寫；調好後把數值寫死回這裡）
const DEFAULT_TUNE = {
  brandLeft: 1.5,
  brandTop: 8,
  brandSize: 8.2, // vw
  descX: 7,
  descY: 0,
  descGap: 12,
  descSize: 1.4,
  descLine: 1.5,
  descAlpha: 0.9,
  glowLeft: 16.5,
  glowTop: 65,
  glowW: 12,
  glowH: 18,
  mobileStageWidth: 248,
  mobileBrandLeft: 4,
  mobileBrandTop: 15, // 原 9.5 太貼 nav、下方留白過多（使用者回饋）
  mobileBrandSize: 12,
  mobileDescX: 7,
  mobileDescY: 0,
  mobileDescGap: 12,
  mobileDescSize: 3.8,
  mobileDescLine: 1.5,
  mobileDescAlpha: 0.9,
  mobileBubbleX: -3,
  mobileBubbleY: 14.5,
  mobileBubbleScale: 0.6,
  mobileSignX: 0,
  mobileSignY: 0,
  mobileSignScale: 1,
  stars: {
    1: { x: 0, y: 0 },
    2: { x: 0, y: 0 },
    3: { x: 0, y: 0 },
    4: { x: 1.5, y: 4 },
    5: { x: 0, y: 0 },
    6: { x: 0, y: 0 },
    7: { x: 0, y: 0 },
    8: { x: 0, y: 0 },
  },
};

export default function BrandSection() {
  const { lang } = useLanguage();
  const brandCopy =
    lang === 'en'
      ? { line1: 'Original illustration IP — characters, apparel & merch', line2: 'Knock knock — come on in!', enterAlt: 'Knock to enter GOOGOOlii' }
      : { line1: '自有插畫 IP 角色、服飾與周邊商品', line2: '敲敲門，進來逛逛！', enterAlt: '敲敲門進入 GOOGOOlii' };
  const rootRef = useRef(null);
  const posterRef = useRef(null);
  const brandRef = useRef(null);
  const [tune, setTune] = useState(DEFAULT_TUNE);
  const [lit, setLit] = useState(false); // 燈是否亮（招牌＋螢幕）
  const [doorOpen, setDoorOpen] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(SHOW_OVERLAY);
  const isEnteringRef = useRef(false);

  // 入場：元件就定位，但招牌＋螢幕「先不亮」
  useEffect(() => {
    if (!rootRef.current) return undefined;
    const ctx = gsap.context(() => {
      const q = (selector) => Array.from(rootRef.current?.querySelectorAll(selector) || []);
      const setIf = (selector, vars) => {
        const targets = q(selector);
        if (targets.length) gsap.set(targets, vars);
        return targets;
      };
      const houseParts = setIf('.bs-house, .bs-chimney, .bs-door-inside, .bs-door-closed', { opacity: 0 });
      const awning = setIf('.bs-awning', { opacity: 0, y: '-4%' });
      const signCharacter = setIf('.bs-sign-character', { opacity: 0, x: '-5%' });
      const signage = setIf('.bs-signage', { opacity: 0.3, filter: 'brightness(0.45)' });
      const stars = setIf('.bs-star', { opacity: 0 });
      const desc = setIf('.bs-desc', { opacity: 0 });
      setIf('.bs-bg', { opacity: 1 });
      setIf('.bs-door-solid', { opacity: 0, rotationY: 0, transformOrigin: 'left center' });
      setIf('.bs-screen-glow', { opacity: 0 }); // 螢幕先暗
      setIf('.bs-brand__title', { opacity: 0 });
      setIf('.bs-bubble', { opacity: 0, scale: 0, transformOrigin: 'center center' });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: rootRef.current, start: 'top 78%', once: true },
      });

      if (houseParts.length) tl.to(houseParts, { opacity: 1, duration: 0.4 }, 0);
      if (awning.length) tl.to(awning, { opacity: 1, y: '0%', duration: 0.3 }, 0.2);
      if (signCharacter.length) tl.to(signCharacter, { opacity: 1, x: '0%', duration: 0.3 }, 0.3);
      if (signage.length) {
        tl
        // 招牌只是「出現」，仍維持暗（不亮）
          .to(signage, { opacity: 1, duration: 0.4 }, 0.4);
      }
      if (stars.length) tl.to(stars, { opacity: 1, duration: 0.3, stagger: 0.12 }, 0.5);
      tl.add(() => {
        if (brandRef.current) {
          gsap.set(brandRef.current, { opacity: 1 });
          const fx = new TextScramble(brandRef.current);
          fx.setText('MY BRAND');
        }
      }, 1.2);
      if (desc.length) tl.to(desc, { opacity: 1, duration: 0.4 }, 1.5);
    }, rootRef.current);
    return () => ctx.revert();
  }, []);

  // 預載門後拼貼頁的圖：頁面載入後趁瀏覽器空檔先在背景載好，
  // 使用者滑到門、點進去時就不用等（總量約 1.2MB）
  useEffect(() => {
    let idleId;
    let timeoutId;
    const preload = () => {
      COLLAGE_ASSETS.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    };
    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(preload, { timeout: 3000 });
    } else {
      timeoutId = window.setTimeout(preload, 1500);
    }
    return () => {
      if (idleId && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  // 切版「定住後」再滑一下 → 觸發點燈（pin 之後）
  useEffect(() => {
    if (!rootRef.current) return undefined;
    const st = ScrollTrigger.create({
      trigger: rootRef.current,
      start: 'top -85%',
      once: true,
      onEnter: () => setLit(true),
    });
    return () => st.kill();
  }, []);

  // 點燈：招牌亮 + 螢幕亮 + 泡泡出現 + 門做「可開門」示意動畫
  useEffect(() => {
    if (!lit || !rootRef.current) return undefined;
    const ctx = gsap.context(() => {
      const q = (selector) => Array.from(rootRef.current?.querySelectorAll(selector) || []);
      const signage = q('.bs-signage');
      const screenGlow = q('.bs-screen-glow');
      const bubble = q('.bs-bubble');
      const doorClosed = q('.bs-door-closed');

      if (signage.length) {
        gsap.to(signage, {
          opacity: 1,
          filter: 'brightness(1.2) drop-shadow(0 0 10px rgba(255,165,0,0.6))',
          duration: 0.6,
        });
      }
      if (screenGlow.length) gsap.to(screenGlow, { opacity: 1, duration: 0.5 });
      if (bubble.length) {
        gsap.to(bubble, { opacity: 1, scale: 1, ease: 'back.out(1.7)', duration: 0.4, delay: 0.3 });
        // 泡泡以中心為圓心、左右對稱擺盪（−3°↔+3°）
        gsap.fromTo(
          bubble,
          { rotation: -3 },
          {
            rotation: 3,
            transformOrigin: 'center center',
            duration: 0.9,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 0.7,
          }
        );
      }
      // 門「半開又合上」反覆示意，提示可點擊進入
      if (doorClosed.length) {
        gsap.to(doorClosed, {
          rotationY: -14,
          transformOrigin: DOOR_HINGE,
          duration: 0.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }
    }, rootRef.current);
    return () => ctx.revert();
  }, [lit]);

  // 門互動：door-closed 往內推開，露出後面早已存在的 door-inside
  useEffect(() => {
    if (!rootRef.current) return undefined;
    const ctx = gsap.context(() => {
      if (doorOpen) {
        const q = (selector) => Array.from(rootRef.current?.querySelectorAll(selector) || []);
        const bubble = q('.bs-bubble');
        const doorClosed = q('.bs-door-closed');
        const doorSolid = q('.bs-door-solid');
        const tl = gsap.timeline({
          onComplete: () => setOverlayOpen(true),
        });
        if (bubble.length) {
          tl.to(bubble, { opacity: 0, scale: 0.8, duration: 0.2, overwrite: 'auto' }, 0);
        }
        if (doorClosed.length) {
          tl.to(
            doorClosed,
            {
              opacity: 0,
              duration: 0.12,
              ease: 'none',
              overwrite: 'auto',
            },
            0
          );
        }
        if (doorSolid.length) {
          tl.fromTo(
            doorSolid,
            { opacity: 1, rotationY: 0 },
            {
              rotationY: -96,
              opacity: 1,
              duration: 0.7,
              ease: 'power2.inOut',
              transformOrigin: 'left center',
              overwrite: 'auto',
            },
            0
          );
        }
      }
    }, rootRef.current);
    return () => ctx.revert();
  }, [doorOpen]);

  useEffect(() => {
    if (!posterRef.current) return undefined;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sticky = posterRef.current.querySelector('.brand-posters__sticky');
    const navHeight =
      Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 64;
    const pinTrigger =
      sticky && window.matchMedia('(min-width: 769px)').matches
        ? ScrollTrigger.create({
            trigger: posterRef.current,
            start: `top top+=${navHeight}`,
            end: 'bottom bottom',
            pin: sticky,
            pinSpacing: false,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          })
        : null;

    const ctx = gsap.context(() => {
      const items = Array.from(posterRef.current?.querySelectorAll('.brand-poster__item') || []);
      if (!items.length) return;

      if (reduceMotion) {
        gsap.set(items, { autoAlpha: 1, y: 0, rotation: 0 });
        return;
      }

      gsap.set(items, {
        autoAlpha: 0,
        y: -56,
        rotation: (index) => [-5, 4, -3][index] || 0,
        transformOrigin: '50% 0%',
      });

      const intro = gsap.timeline({
        scrollTrigger: {
          trigger: posterRef.current,
          start: 'top 72%',
          once: true,
        },
      });

      intro.to(items, {
        autoAlpha: 1,
        y: 0,
        rotation: (index) => POSTERS[index]?.settleRotate || 0,
        duration: 0.95,
        stagger: 0.14,
        ease: 'elastic.out(1, 0.52)',
      });

      intro.add(() => {
        items.forEach((item, index) => {
          gsap.to(item, {
            rotation: POSTERS[index]?.swayRotate || 0.8,
            duration: 2.8 + index * 0.25,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            transformOrigin: '50% 0%',
          });
        });
      });
    }, posterRef.current);

    return () => {
      pinTrigger?.kill();
      ctx.revert();
    };
  }, []);

  // 點門 / 點泡泡：若還沒亮燈先點燈，再開門
  const handleEnterClick = () => {
    if (isEnteringRef.current) return;
    isEnteringRef.current = true;
    if (!lit) {
      setLit(true);
    }
    setDoorOpen(true);
  };

  const handleOverlayClose = () => {
    isEnteringRef.current = false;
    setOverlayOpen(false);
    setDoorOpen(false);
  };

  // 把可調數值灌成 CSS 變數；手機版參數只在 media query 裡使用
  const sectionVars = {
    '--brand-left': `${tune.brandLeft}%`,
    '--brand-top': `${tune.brandTop}%`,
    '--brand-size': `${tune.brandSize}vw`,
    '--desc-x': `${tune.descX}px`,
    '--desc-y': `${tune.descY}px`,
    '--desc-gap': `${tune.descGap}px`,
    '--desc-size': `${tune.descSize}vw`,
    '--desc-line': tune.descLine,
    '--desc-alpha': tune.descAlpha,
    '--glow-left': `${tune.glowLeft}%`,
    '--glow-top': `${tune.glowTop}%`,
    '--glow-w': `${tune.glowW}%`,
    '--glow-h': `${tune.glowH}%`,
    '--mobile-stage-width': `${tune.mobileStageWidth}vw`,
    '--mobile-brand-left': `${tune.mobileBrandLeft}%`,
    '--mobile-brand-top': `${tune.mobileBrandTop}%`,
    '--mobile-brand-size': `${tune.mobileBrandSize}vw`,
    '--mobile-desc-x': `${tune.mobileDescX}px`,
    '--mobile-desc-y': `${tune.mobileDescY}px`,
    '--mobile-desc-gap': `${tune.mobileDescGap}px`,
    '--mobile-desc-size': `${tune.mobileDescSize}vw`,
    '--mobile-desc-line': tune.mobileDescLine,
    '--mobile-desc-alpha': tune.mobileDescAlpha,
    '--mobile-bubble-x': `${tune.mobileBubbleX}%`,
    '--mobile-bubble-y': `${tune.mobileBubbleY}%`,
    '--mobile-bubble-scale': tune.mobileBubbleScale,
    '--mobile-sign-x': `${tune.mobileSignX}%`,
    '--mobile-sign-y': `${tune.mobileSignY}%`,
    '--mobile-sign-scale': tune.mobileSignScale,
  };

  return (
    <>
      <section className="brand-section" ref={rootRef} id="brand" style={sectionVars}>
        <div className="brand-section__sticky">
          <div className="brand-section__stage">
          <img className="bs-layer bs-bg" src={assetPath(`${BASE}/BG.png`)} alt="" />
          <img className="bs-layer bs-house" src={assetPath(`${BASE}/house-body.png`)} alt="" />
          <img className="bs-layer bs-chimney" src={assetPath(`${BASE}/chimney.png`)} alt="" />
          <img className="bs-layer bs-door-inside" src={assetPath(`${BASE}/door-inside.png`)} alt="" />
          <div className="bs-door-solid" aria-hidden="true" />
          <img
            className="bs-layer bs-door-closed"
            src={assetPath(`${BASE}/door-closed.png`)}
            alt={brandCopy.enterAlt}
            onClick={handleEnterClick}
          />
          <img className="bs-layer bs-awning" src={assetPath(`${BASE}/awning.png`)} alt="" />
          <img className="bs-layer bs-signage" src={assetPath(`${BASE}/signage-googoolii.png`)} alt="GOOGOOlii" />
          <img className="bs-layer bs-sign-character" src={assetPath(`${BASE}/sign-character.png`)} alt="" />
          {/* 只亮螢幕框：halo 同時當「點螢幕點燈」熱區 + tint 把白點成淺黃 */}
          <div className="bs-screen-glow bs-screen-halo" onClick={() => setLit(true)} title={lang === 'en' ? 'Light up the sign' : '點亮招牌'} />
          <div className="bs-screen-glow bs-screen-tint" />
          {STARS.map((n) => (
            <div
              className={`bs-layer bs-star bs-star--${n}`}
              key={n}
              style={{ transform: `translate(${tune.stars[n].x}%, ${tune.stars[n].y}%)` }}
            >
              <img src={assetPath(`${BASE}/star-${n}.png`)} alt="" />
            </div>
          ))}
          <div className="bs-layer bs-bubble-position">
            <img
              className="bs-layer bs-bubble"
              src={assetPath(`${BASE}/bubble-knock.png`)}
              alt="Knock knock"
              onClick={handleEnterClick}
            />
          </div>

          {/* 座標格線（?grid）— 讀出元件 left/top % */}
          {SHOW_GRID && (
            <div className="bs-grid">
              {Array.from({ length: 11 }).map((_, i) => (
                <div className="bs-grid__v" style={{ left: `${i * 10}%` }} key={`v${i}`}>
                  <span>{i * 10}</span>
                </div>
              ))}
              {Array.from({ length: 11 }).map((_, i) => (
                <div className="bs-grid__h" style={{ top: `${i * 10}%` }} key={`h${i}`}>
                  <span>{i * 10}</span>
                </div>
              ))}
            </div>
          )}
          </div>

          {/* MY BRAND 文字：錨定視窗左上（不被商店裁切影響） */}
          <div className="bs-brand">
            {/* 手機版裝飾星星（6 顆，實心/描邊交錯），填補標題周圍的留白 */}
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <svg key={n} className={`bs-brand__deco bs-brand__deco--${n}`} viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12 1l2.9 7.3L22 9.5l-5.5 4.7L18.4 22 12 17.7 5.6 22l1.9-7.8L2 9.5l7.1-1.2z"
                  fill={n % 2 === 0 ? 'none' : '#fff573'}
                  stroke={n % 2 === 0 ? '#fff573' : 'none'}
                  strokeWidth={n % 2 === 0 ? 1.6 : 0}
                />
              </svg>
            ))}
            <h2 className="bs-brand__title" ref={brandRef}>
              MY BRAND
            </h2>
            <p className={`bs-desc bs-desc--${lang}`}>
              {brandCopy.line1}
              <br />
              {brandCopy.line2}
            </p>
          </div>

          {SHOW_EDIT && <BrandEditPanel tune={tune} setTune={setTune} />}
        </div>
      </section>

      <section className="brand-posters" ref={posterRef} aria-label="Poster showcase">
        <div className="brand-posters__sticky">
          <div className="brand-posters__rail" aria-hidden="true" />
          <div className="brand-posters__stage">
            {POSTERS.map((poster) => (
              <figure
                className={`brand-poster__item brand-poster__item--${poster.id}`}
                key={poster.id}
                style={{
                  '--poster-left': `${(poster.left / 1920) * 100}%`,
                  '--poster-top': `${(poster.top / 1097) * 100}%`,
                  '--poster-width': `${(poster.width / 1920) * 100}%`,
                  '--poster-height': `${(poster.height / 1097) * 100}%`,
                  '--poster-image-width': `${(1920 / poster.width) * 100}%`,
                  '--poster-image-left': `${-(poster.left / poster.width) * 100}%`,
                  '--poster-image-top': `${-(poster.top / poster.height) * 100}%`,
                  '--poster-title-color': poster.color,
                }}
              >
                <div className="brand-poster__surface">
                  <img src={assetPath(poster.src)} alt={poster.alt} />
                  <figcaption>{poster.title}</figcaption>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {overlayOpen && <GraphicOverlay onClose={handleOverlayClose} />}
    </>
  );
}
