import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from './context/LanguageContext.jsx';
import { assetPath } from './utils/assetPath.js';
import { projects } from './data/projects.js';
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

// 只有首屏（Hero + Digital 標題區）需要在進場前備好。手機頻寬有限，一次高優先搶載
// 幾十張圖＋所有專案影片會把首屏拖垮（連 43K 的燈罩都排隊），其餘一律延後背景載入。
const HERO_CRITICAL_ASSETS = [
  '/images/hero-character.png',
  '/images/graphic/digital-work/light.png',
  '/images/graphic/digital-work/arrow-left.png',
  '/images/graphic/digital-work/arrow-right.png',
  '/images/graphic/digital-work/light-shade.png',
  '/images/graphic/digital-work/light-cord.png',
];

// 進場結束後在 idle 背景預載（brand section、專案 poster、CV 照…），不搶首屏頻寬。
const DEFERRED_CRITICAL_ASSETS = [
  '/videos/projects/pickmin-hero-poster2.jpg',
  '/videos/projects/ui-tweaker-demo-poster2.jpg',
  '/images/projects/googoolii/product-shopping.jpg',
  '/images/projects/work-order-sync-bot/work-order-cover-full.png',
  '/images/graphic/brand-section/BG.png',
  '/images/graphic/brand-section/house-body.png',
  '/images/graphic/brand-section/chimney.png',
  '/images/graphic/brand-section/door-inside.png',
  '/images/graphic/brand-section/door-closed.png',
  '/images/graphic/brand-section/awning.png',
  '/images/graphic/brand-section/signage-googoolii.png',
  '/images/graphic/brand-section/sign-character.png',
  '/images/graphic/brand-section/bubble-knock.png',
  '/images/graphic/brand-section/star-1.png',
  '/images/graphic/brand-section/star-2.png',
  '/images/graphic/brand-section/star-3.png',
  '/images/graphic/brand-section/star-4.png',
  '/images/graphic/brand-section/star-5.png',
  '/images/graphic/brand-section/star-6.png',
  '/images/graphic/brand-section/star-7.png',
  '/images/graphic/brand-section/star-8.png',
  '/images/about/cv Portrait.jpg',
];

function addAsset(assets, src) {
  if (src) assets.add(src);
}

function collectProjectImageAssets() {
  const assets = new Set();
  projects.forEach((project) => {
    addAsset(assets, project.poster);
    if (project.mediaType !== 'video') addAsset(assets, project.media);
    ['zh', 'en'].forEach((lang) => {
      const caseStudy = project.caseStudy?.[lang];
      addAsset(assets, caseStudy?.heroImage);
      addAsset(assets, caseStudy?.heroMobileImage);
    });
  });
  return Array.from(assets);
}

const PROJECT_IMAGE_ASSETS = collectProjectImageAssets();
// 進場後才在背景暖的資產（不含首屏 HERO_CRITICAL）。專案影片不在此列——太重，改由
// 開啟專案時各自載入（warmProjectMedia + 元件 lazy），避免手機首屏被幾 MB 影片塞爆。
const DEFERRED_IMAGE_ASSETS = Array.from(new Set([...DEFERRED_CRITICAL_ASSETS, ...PROJECT_IMAGE_ASSETS]));

function waitForImage(src, timeout = 5000) {
  return new Promise((resolve) => {
    const image = new Image();
    let settled = false;
    let timer = null;
    const finish = () => {
      if (settled) return;
      settled = true;
      if (timer) window.clearTimeout(timer);
      resolve();
    };
    timer = window.setTimeout(finish, timeout);
    image.onload = () => {
      if (image.decode) image.decode().catch(() => {}).finally(finish);
      else finish();
    };
    image.onerror = () => {
      finish();
    };
    image.src = assetPath(src);
    if (image.complete) {
      window.clearTimeout(timer);
      finish();
    }
  });
}

export default function App() {
  const { htmlLang } = useLanguage();
  const heroRef = useRef(null);
  const [introDone, setIntroDone] = useState(false);
  const [criticalAssetsReady, setCriticalAssetsReady] = useState(false);

  const scrollToCurrentHash = useCallback(() => {
    const hash = window.location.hash.replace(/^#/, '');
    if (!hash) return;
    const target = document.getElementById(decodeURIComponent(hash));
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior: 'auto' });
    requestAnimationFrame(() => {
      window.scrollTo({ top, behavior: 'auto' });
      ScrollTrigger.refresh();
    });
  }, []);

  const handleIntroDone = useCallback(() => {
    setIntroDone(true);
    [0, 160, 520].forEach((delay) => window.setTimeout(scrollToCurrentHash, delay));
  }, [scrollToCurrentHash]);

  // 進場只等首屏圖＋字型（縮短逾時）：不再等 brand section／所有專案圖＋影片，
  // 手機才不會卡在 loading 或首屏搶頻寬。
  useEffect(() => {
    let cancelled = false;
    const timeout = new Promise((resolve) => window.setTimeout(resolve, 3500));
    const fontsReady = document.fonts?.ready?.catch(() => {}) || Promise.resolve();
    const imagesReady = Promise.allSettled(HERO_CRITICAL_ASSETS.map((src) => waitForImage(src)));

    Promise.race([Promise.allSettled([imagesReady, fontsReady]), timeout]).then(() => {
      if (!cancelled) setCriticalAssetsReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // 進場結束後，在瀏覽器空檔背景預載其餘圖片（brand section／專案 poster），不搶首屏。
  // 專案影片不在這裡預抓，改由開啟專案時載入，省手機流量。
  useEffect(() => {
    if (!introDone) return undefined;
    let idleId = null;
    const run = () => DEFERRED_IMAGE_ASSETS.forEach((src) => waitForImage(src));
    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(run, { timeout: 2500 });
    } else {
      idleId = window.setTimeout(run, 400);
    }
    return () => {
      if (idleId === null) return;
      if ('cancelIdleCallback' in window) window.cancelIdleCallback(idleId);
      else window.clearTimeout(idleId);
    };
  }, [introDone]);

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

  useEffect(() => {
    if (!introDone) return undefined;
    const timers = [0, 160, 520].map((delay) => window.setTimeout(scrollToCurrentHash, delay));
    window.addEventListener('hashchange', scrollToCurrentHash);
    return () => {
      timers.forEach((id) => window.clearTimeout(id));
      window.removeEventListener('hashchange', scrollToCurrentHash);
    };
  }, [introDone, scrollToCurrentHash]);

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
      <LoadingBlinds ready={criticalAssetsReady} onDone={handleIntroDone} />
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
