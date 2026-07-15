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
const GPU_CROP_BASE = `${BASE}/gpu-crops`;
const DOT_DOG_V2_SPRITESHEET = `${BASE}/dot-dog-v2/spritesheet-row.png`;
const DOT_DOG_V3_SPRITESHEET = `${BASE}/dot-dog-v3/spritesheet-row.png`;
const POSTER_BASE = 'images/graphic/poster';
const STARS = [1, 2, 3, 4, 5, 6, 7, 8];
const STAGE_CANVAS = { width: 3840, height: 2160 };
const STAR_BOUNDS = {
  1: { x: 491, y: 817, w: 192, h: 181 },
  2: { x: 143, y: 1101, w: 125, h: 129 },
  3: { x: 210, y: 1524, w: 276, h: 262 },
  4: { x: 2507, y: 145, w: 287, h: 273 },
  5: { x: 3502, y: 244, w: 107, h: 111 },
  6: { x: 3175, y: 544, w: 184, h: 191 },
  7: { x: 3149, y: 1624, w: 187, h: 190 },
  8: { x: 3586, y: 1173, w: 150, h: 145 },
};
const BUBBLE_BOUNDS = { x: 2445, y: 930, w: 945, h: 522 };
const DOOR_BOUNDS = { x: 1677, y: 1214, w: 486, h: 771 };
const SIGNAGE_BOUNDS = { x: 1336, y: 859, w: 1168, h: 260 };
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
const DOOR_HINGE = 'left center';
const COLLAGE_HASH = 'mybrand';
const COLLAGE_HASH_ALIASES = new Set([COLLAGE_HASH, 'my-brand', 'brand-collage']);

function cropStyle({ x, y, w, h }, offset = { x: 0, y: 0 }) {
  return {
    left: `calc(${(x / STAGE_CANVAS.width) * 100}% + ${offset.x || 0}%)`,
    top: `calc(${(y / STAGE_CANVAS.height) * 100}% + ${offset.y || 0}%)`,
    width: `${(w / STAGE_CANVAS.width) * 100}%`,
    height: `${(h / STAGE_CANVAS.height) * 100}%`,
  };
}

function getCurrentHashId() {
  if (typeof window === 'undefined') return '';
  return decodeURIComponent(window.location.hash.replace(/^#/, '')).toLowerCase();
}

function isCollageUrl() {
  return COLLAGE_HASH_ALIASES.has(getCurrentHashId());
}

function setCollageHash() {
  if (typeof window === 'undefined' || isCollageUrl()) return;
  const url = new URL(window.location.href);
  url.hash = COLLAGE_HASH;
  window.history.pushState({ portfolioOverlay: 'collage' }, '', url);
}

function replaceBrandHash() {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  url.hash = 'brand';
  window.history.replaceState(null, '', url);
}

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
  dogX: 0.1,
  dogY: -1.7,
  dogSize: 10.5,
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
  mobileDogX: 0.1,
  mobileDogY: -5.8,
  mobileDogSize: 31.8,
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
  const openFromUrl = SHOW_OVERLAY || isCollageUrl();
  const brandCopy =
    lang === 'en'
      ? { line1: 'Original illustration IP — characters, apparel & merch', line2: 'Knock knock — come on in!', enterAlt: 'Knock to enter GOOGOOlii' }
      : { line1: '自有插畫 IP 角色、服飾與周邊商品', line2: '敲敲門，進來逛逛！', enterAlt: '敲敲門進入 GOOGOOlii' };
  const rootRef = useRef(null);
  const posterRef = useRef(null);
  const brandRef = useRef(null);
  const dogJumperRef = useRef(null);
  const [tune, setTune] = useState(DEFAULT_TUNE);
  const [lit, setLit] = useState(openFromUrl); // 燈是否亮（招牌＋螢幕）
  const [dogActive, setDogActive] = useState(openFromUrl);
  const [doorOpen, setDoorOpen] = useState(openFromUrl);
  const [overlayOpen, setOverlayOpen] = useState(openFromUrl);
  const isEnteringRef = useRef(false);
  const pushedCollageHashRef = useRef(false);

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
      const signage = setIf('.bs-signage', { opacity: 0.3 });
      const stars = setIf('.bs-star', { opacity: 0 });
      const desc = setIf('.bs-desc', { opacity: 0 });
      setIf('.bs-bg', { opacity: 1 });
      setIf('.bs-door-solid', { opacity: 0, rotationY: 0, transformPerspective: 900, transformOrigin: 'left center' });
      setIf('.bs-screen-glow', { opacity: 0 }); // 螢幕先暗
      setIf('.bs-brand__title', { opacity: 0 });
      setIf('.bs-bubble-crop', { opacity: 0, scale: 0, transformOrigin: 'center center' });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: rootRef.current, start: 'top 78%', once: true },
      });
      tl.add(() => setDogActive(true), 0);

      if (houseParts.length) tl.to(houseParts, { opacity: 1, duration: 0.4 }, 0);
      if (awning.length) {
        tl.to(awning, {
          opacity: 1,
          y: '0%',
          duration: 0.3,
          onComplete: () => gsap.set(awning, { clearProps: 'transform' }),
        }, 0.2);
      }
      if (signCharacter.length) {
        tl.to(signCharacter, {
          opacity: 1,
          x: '0%',
          duration: 0.3,
          onComplete: () => gsap.set(signCharacter, { clearProps: 'transform' }),
        }, 0.3);
      }
      if (signage.length) {
        tl
        // 招牌只是「出現」，仍維持暗（不亮）
          .to(signage, { opacity: 0.55, duration: 0.4 }, 0.4);
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
      tl.add(() => rootRef.current?.classList.add('is-static-scene-ready'), 1.9);
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

  useEffect(() => {
    const syncCollageUrl = () => {
      const shouldOpen = SHOW_OVERLAY || isCollageUrl();
      if (shouldOpen) {
        setLit(true);
        setDoorOpen(true);
        setOverlayOpen(true);
        isEnteringRef.current = true;
        return;
      }
      setOverlayOpen(false);
      setDoorOpen(false);
      isEnteringRef.current = false;
      pushedCollageHashRef.current = false;
    };

    syncCollageUrl();
    window.addEventListener('hashchange', syncCollageUrl);
    window.addEventListener('popstate', syncCollageUrl);
    return () => {
      window.removeEventListener('hashchange', syncCollageUrl);
      window.removeEventListener('popstate', syncCollageUrl);
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
      const bubble = q('.bs-bubble-crop');
      const doorClosed = q('.bs-door-closed');

      if (signage.length) {
        gsap.to(signage, {
          opacity: 1,
          duration: 0.6,
        });
      }
      if (screenGlow.length) gsap.to(screenGlow, { opacity: 1, duration: 0.5 });
      if (bubble.length) {
        gsap.to(bubble, { opacity: 1, scale: 1, ease: 'back.out(1.7)', duration: 0.4, delay: 0.3 });
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
      if (doorClosed.length) {
        gsap.to(doorClosed, {
          rotationY: -14,
          transformPerspective: 900,
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
        const bubble = q('.bs-bubble-crop');
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
            { opacity: 1, rotationY: 0, transformPerspective: 900 },
            {
              rotationY: -96,
              transformPerspective: 900,
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
    if (!isCollageUrl()) {
      pushedCollageHashRef.current = true;
      setCollageHash();
    }
    if (!lit) {
      setLit(true);
    }
    setDoorOpen(true);
  };

  const handleDogJump = () => {
    const jumper = dogJumperRef.current;
    if (!jumper || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const facing = jumper.querySelector('.bs-road-dog__facing');
    const facingMatrix = facing ? new DOMMatrixReadOnly(getComputedStyle(facing).transform) : null;
    const tailIsOnLeft = !facingMatrix || facingMatrix.a > 0;
    const jumpPeak = Math.round((72 + Math.random() * 46) * 10) / 10;
    const jumpReturnHeight = Math.round(jumpPeak * 0.82 * 10) / 10;
    jumper.style.setProperty('--jump-peak', `${-jumpPeak}%`);
    jumper.style.setProperty('--jump-return-height', `${-jumpReturnHeight}%`);
    jumper.style.setProperty('--jump-rotate', tailIsOnLeft ? '30deg' : '-30deg');
    jumper.style.setProperty('--jump-return-rotate', tailIsOnLeft ? '18deg' : '-18deg');
    jumper.classList.remove('is-jumping');
    // 只在點擊時強制重新計算，讓連續點擊也能從頭播放跳躍。
    void jumper.offsetWidth;
    jumper.classList.add('is-jumping');
  };

  const handleOverlayClose = () => {
    if (isCollageUrl()) {
      if (pushedCollageHashRef.current) {
        window.history.back();
      } else {
        replaceBrandHash();
        isEnteringRef.current = false;
        setOverlayOpen(false);
        setDoorOpen(false);
      }
      return;
    }
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
    '--dog-x': `${tune.dogX}%`,
    '--dog-y': `${tune.dogY}%`,
    '--dog-size': `${tune.dogSize}vw`,
    '--static-scene': `url("${assetPath(`${GPU_CROP_BASE}/static-scene.png`)}")`,
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
    '--mobile-dog-x': `${tune.mobileDogX}%`,
    '--mobile-dog-y': `${tune.mobileDogY}%`,
    '--mobile-dog-size': `${tune.mobileDogSize}vw`,
  };

  return (
    <>
      <section className="brand-section" ref={rootRef} id="brand" style={sectionVars}>
        <span className="brand-section__anchor" id={COLLAGE_HASH} aria-hidden="true" />
        <div className="brand-section__sticky">
          <div className="brand-section__stage">
          <img className="bs-layer bs-static-part bs-bg" src={assetPath(`${BASE}/BG.png`)} alt="" />
          <img className="bs-layer bs-static-part bs-house" src={assetPath(`${BASE}/house-body.png`)} alt="" />
          <img className="bs-layer bs-static-part bs-chimney" src={assetPath(`${BASE}/chimney.png`)} alt="" />
          <img className="bs-layer bs-static-part bs-door-inside" src={assetPath(`${BASE}/door-inside.png`)} alt="" />
          <div className="bs-door-solid" aria-hidden="true" />
          <button
            type="button"
            className="bs-door-closed"
            style={cropStyle(DOOR_BOUNDS)}
            aria-label={brandCopy.enterAlt}
            onClick={handleEnterClick}
          >
            <img
              className="bs-cropped-canvas-image"
              src={assetPath(`${GPU_CROP_BASE}/door-closed.png`)}
              alt=""
            />
          </button>
          <img className="bs-layer bs-static-part bs-awning" src={assetPath(`${BASE}/awning.png`)} alt="" />
          <div className={`bs-signage${lit ? ' is-lit' : ''}`} style={cropStyle(SIGNAGE_BOUNDS)} role="img" aria-label="GOOGOOlii">
            <span className="bs-signage__crop">
              <img
                className="bs-cropped-canvas-image"
                src={assetPath(`${GPU_CROP_BASE}/signage-googoolii.png`)}
                alt=""
              />
            </span>
          </div>
          <img className="bs-layer bs-static-part bs-sign-character" src={assetPath(`${BASE}/sign-character.png`)} alt="" />
          <div className={`bs-road-dog${dogActive ? ' is-animated' : ''}`}>
            <button
              type="button"
              className="bs-road-dog__rider"
              onClick={handleDogJump}
              aria-label={lang === 'en' ? 'Make the skateboard dog jump' : '讓滑板狗跳躍'}
            >
              <span
                ref={dogJumperRef}
                className="bs-road-dog__jumper"
                onAnimationEnd={(event) => {
                  if (event.animationName === 'bs-road-dog-click-jump') {
                    event.currentTarget.classList.remove('is-jumping');
                  }
                }}
              >
                <span className="bs-road-dog__facing">
                  <span
                    className="bs-road-dog__sprite bs-road-dog__sprite--v2"
                    style={{ backgroundImage: `url("${assetPath(DOT_DOG_V2_SPRITESHEET)}")` }}
                  />
                  <span
                    className="bs-road-dog__sprite bs-road-dog__sprite--v3"
                    style={{ backgroundImage: `url("${assetPath(DOT_DOG_V3_SPRITESHEET)}")` }}
                  />
                </span>
              </span>
            </button>
          </div>
          {/* 只亮螢幕框：halo 同時當「點螢幕點燈」熱區 + tint 把白點成淺黃 */}
          <div className="bs-screen-glow bs-screen-halo" onClick={() => setLit(true)} title={lang === 'en' ? 'Light up the sign' : '點亮招牌'} />
          <div className="bs-screen-glow bs-screen-tint" />
          {STARS.map((n) => {
            const bounds = STAR_BOUNDS[n];
            return (
              <div
                className={`bs-star bs-star--${n}`}
                key={n}
                style={cropStyle(bounds, tune.stars[n])}
              >
                <span className="bs-star__twinkle">
                  <img
                    className="bs-cropped-canvas-image"
                    src={assetPath(`${GPU_CROP_BASE}/star-${n}.png`)}
                    alt=""
                  />
                </span>
              </div>
            );
          })}
          <div className="bs-layer bs-bubble-position">
            <button
              type="button"
              className="bs-bubble-crop"
              style={cropStyle(BUBBLE_BOUNDS)}
              aria-label="Knock knock"
              onClick={handleEnterClick}
            >
              <img
                className="bs-cropped-canvas-image"
                src={assetPath(`${GPU_CROP_BASE}/bubble-knock.png`)}
                alt=""
              />
            </button>
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
