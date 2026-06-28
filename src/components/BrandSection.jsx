import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextScramble } from '../utils/TextScramble.js';
import GraphicOverlay from './GraphicOverlay.jsx';
import BrandEditPanel from './BrandEditPanel.jsx';
import '../styles/components/BrandSection.css';

gsap.registerPlugin(ScrollTrigger);

const BASE = '/images/graphic/brand-section';
const STARS = [1, 2, 3, 4, 5, 6, 7, 8];
const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
const SHOW_GRID = !!params && params.has('grid');
const SHOW_EDIT = !!params && params.has('edit');
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
  mobileBrandTop: 9.5,
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
  const rootRef = useRef(null);
  const brandRef = useRef(null);
  const [tune, setTune] = useState(DEFAULT_TUNE);
  const [lit, setLit] = useState(false); // 燈是否亮（招牌＋螢幕）
  const [doorOpen, setDoorOpen] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const isEnteringRef = useRef(false);

  // 入場：元件就定位，但招牌＋螢幕「先不亮」
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.bs-bg', { opacity: 1 });
      gsap.set('.bs-house, .bs-chimney, .bs-door-inside, .bs-door-closed', { opacity: 0 });
      gsap.set('.bs-door-solid', { opacity: 0, rotationY: 0, transformOrigin: 'left center' });
      gsap.set('.bs-awning', { opacity: 0, y: '-4%' });
      gsap.set('.bs-sign-character', { opacity: 0, x: '-5%' });
      gsap.set('.bs-screen-glow', { opacity: 0 }); // 螢幕先暗
      gsap.set('.bs-signage', { opacity: 0.3, filter: 'brightness(0.45)' }); // 招牌先暗
      gsap.set('.bs-star', { opacity: 0 });
      gsap.set('.bs-brand', { opacity: 0 });
      gsap.set('.bs-desc', { opacity: 0 });
      gsap.set('.bs-bubble', { opacity: 0, scale: 0, transformOrigin: 'center center' });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: rootRef.current, start: 'top 78%', once: true },
      });

      tl.to('.bs-house, .bs-chimney, .bs-door-inside, .bs-door-closed', { opacity: 1, duration: 0.4 }, 0)
        .to('.bs-awning', { opacity: 1, y: '0%', duration: 0.3 }, 0.2)
        .to('.bs-sign-character', { opacity: 1, x: '0%', duration: 0.3 }, 0.3)
        // 招牌只是「出現」，仍維持暗（不亮）
        .to('.bs-signage', { opacity: 1, duration: 0.4 }, 0.4)
        .to('.bs-star', { opacity: 1, duration: 0.3, stagger: 0.12 }, 0.5)
        .add(() => {
          gsap.set('.bs-brand', { opacity: 1 });
          if (brandRef.current) {
            const fx = new TextScramble(brandRef.current);
            fx.setText('MY BRAND');
          }
        }, 1.2)
        .to('.bs-desc', { opacity: 1, duration: 0.4 }, 1.5);
    }, rootRef);
    return () => ctx.revert();
  }, []);

  // 切版「定住後」再滑一下 → 觸發點燈（pin 之後）
  useEffect(() => {
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
    if (!lit) return;
    const ctx = gsap.context(() => {
      gsap.to('.bs-signage', {
        opacity: 1,
        filter: 'brightness(1.2) drop-shadow(0 0 10px rgba(255,165,0,0.6))',
        duration: 0.6,
      });
      gsap.to('.bs-screen-glow', { opacity: 1, duration: 0.5 });
      gsap.to('.bs-bubble', { opacity: 1, scale: 1, ease: 'back.out(1.7)', duration: 0.4, delay: 0.3 });
      // 門「半開又合上」反覆示意，提示可點擊進入
      gsap.to('.bs-door-closed', {
        rotationY: -14,
        transformOrigin: DOOR_HINGE,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, rootRef);
    return () => ctx.revert();
  }, [lit]);

  // 門互動：door-closed 往內推開，露出後面早已存在的 door-inside
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (doorOpen) {
        const tl = gsap.timeline({
          onComplete: () => setOverlayOpen(true),
        });
        tl.to('.bs-bubble', { opacity: 0, scale: 0.8, duration: 0.2, overwrite: 'auto' }, 0)
          .to(
            '.bs-door-closed',
            {
              opacity: 0,
              duration: 0.12,
              ease: 'none',
              overwrite: 'auto',
            },
            0
          )
          .fromTo(
            '.bs-door-solid',
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
    }, rootRef);
    return () => ctx.revert();
  }, [doorOpen]);

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
    <section className="brand-section" ref={rootRef} id="brand" style={sectionVars}>
      <div className="brand-section__sticky">
        <div className="brand-section__stage">
          <img className="bs-layer bs-bg" src={`${BASE}/BG.png`} alt="" />
          <img className="bs-layer bs-house" src={`${BASE}/house-body.png`} alt="" />
          <img className="bs-layer bs-chimney" src={`${BASE}/chimney.png`} alt="" />
          <img className="bs-layer bs-door-inside" src={`${BASE}/door-inside.png`} alt="" />
          <div className="bs-door-solid" aria-hidden="true" />
          <img
            className="bs-layer bs-door-closed"
            src={`${BASE}/door-closed.png`}
            alt="敲敲門進入 GOOGOOlii"
            onClick={handleEnterClick}
          />
          <img className="bs-layer bs-awning" src={`${BASE}/awning.png`} alt="" />
          <img className="bs-layer bs-signage" src={`${BASE}/signage-googoolii.png`} alt="GOOGOOlii" />
          <img className="bs-layer bs-sign-character" src={`${BASE}/sign-character.png`} alt="" />
          {/* 只亮螢幕框：halo 同時當「點螢幕點燈」熱區 + tint 把白點成淺黃 */}
          <div className="bs-screen-glow bs-screen-halo" onClick={() => setLit(true)} title="點亮招牌" />
          <div className="bs-screen-glow bs-screen-tint" />
          {STARS.map((n) => (
            <div
              className={`bs-layer bs-star bs-star--${n}`}
              key={n}
              style={{ transform: `translate(${tune.stars[n].x}%, ${tune.stars[n].y}%)` }}
            >
              <img src={`${BASE}/star-${n}.png`} alt="" />
            </div>
          ))}
          <div className="bs-layer bs-bubble-position">
            <img
              className="bs-layer bs-bubble"
              src={`${BASE}/bubble-knock.png`}
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
          <h2 className="bs-brand__title" ref={brandRef}>
            MY BRAND
          </h2>
          <p className="bs-desc">
            自有插畫 IP 角色、服飾與周邊商品
            <br />
            敲敲門，進來逛逛！
          </p>
        </div>

        {SHOW_EDIT && <BrandEditPanel tune={tune} setTune={setTune} />}
      </div>

      {overlayOpen && <GraphicOverlay onClose={handleOverlayClose} />}
    </section>
  );
}
